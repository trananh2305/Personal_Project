import OrderModel from "../models/order/orderModel";
import OrderItemModel from "../models/order/orderItemModel";
import { Order } from "../types/order";
import mongoose from "mongoose";
import { getIo } from "../socket";
import { updateTableStatusService } from "./tableService";
export const createOrderService = async (order: Order) => {
  const io = getIo();
  try {
    // Tìm Order đang hoạt động (chưa hoàn thành hoặc chưa hủy)
    let existingOrder = await OrderModel.findOne({
      userId: order.userId,
      tableId: order.tableId,
      status: { $nin: ["COMPLETED", "CANCELED"] },
    }).populate("items");

    let finalOrder;

    if (existingOrder) {
      await updateOrderStatusService(order, existingOrder);
      finalOrder = await OrderModel.findById(existingOrder._id).populate({
        path: "items",
        // populate: {
        //   path: "itemId",
        //   model: "Dish",
        //   populate: [
        //     { path: "categoryId", model: "Category" },
        //   ],
        // },
      });
    } else {
      // Tạo mới đơn hàng nếu chưa có
      const createdItems = await OrderItemModel.insertMany(
        order.items.map((item) => ({
          orderId: null,
          itemId: new mongoose.Types.ObjectId(item.itemId),
          quantity: item.quantity,
          price: item.price,
        }))
      );

      const itemIds = createdItems.map((i) => i._id);
      const totalPrice = createdItems.reduce(
        (sum, item) => sum + item.price,
        0
      );

      const newOrder = await OrderModel.create({
        userId: order.userId,
        tableId: order.tableId,
        items: itemIds,
        totalPrice,
      });

      // Gán lại orderId cho các OrderItem
      await OrderItemModel.updateMany(
        { _id: { $in: itemIds } },
        { $set: { orderId: newOrder._id } }
      );

      const updateTable = await updateTableStatusService(
        order.tableId,
        "OCCUPIED"
      );
      io.emit("newOrder", updateTable);

      finalOrder = await OrderModel.findById(newOrder._id).populate({
        path: "items",
        // populate: {
        //   path: "itemId",
        //   model: "Dish",
        //   populate: [
        //     { path: "categoryId", model: "Category" },
        //     { path: "ingredients", model: "Ingredient" },
        //   ],
        // },
      });
    }

    return finalOrder;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order: " + error.message);
  }
};

const updateOrderStatusService = async (order: Order, existingOrder: any) => {
  try {
    const newOrderItemIds: mongoose.Types.ObjectId[] = [];

    for (const newItem of order.items) {
      const existingItem = await OrderItemModel.findOne({
        orderId: existingOrder._id,
        itemId: newItem.itemId,
        status: "PENDING",
      });

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.price += newItem.price;
        await existingItem.save();

        existingOrder.totalPrice += newItem.price;
      } else {
        const created = await OrderItemModel.create({
          orderId: existingOrder._id,
          itemId: new mongoose.Types.ObjectId(newItem.itemId),
          quantity: newItem.quantity,
          price: newItem.price,
        });

        newOrderItemIds.push(created._id);
        existingOrder.totalPrice += newItem.price;
      }
    }

    // Gom cập nhật 1 lần duy nhất
    const update: any = {
      $set: { totalPrice: existingOrder.totalPrice },
    };
    if (newOrderItemIds.length > 0) {
      update.$push = { items: { $each: newOrderItemIds } };
    }

    await OrderModel.findByIdAndUpdate(existingOrder._id, update);

    // Populate sâu để trả về đầy đủ món ăn
  } catch (error: any) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};
