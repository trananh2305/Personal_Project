import OrderModel from "../models/order/orderModel";
import OrderItemModel from "../models/order/orderItemModel";
import { Order } from "../types/order";
import mongoose from "mongoose";
import { getIo } from "../socket";
import { updateTableStatusService } from "./tableService";
import KitchenQueueModel from "../models/kitchenQueue/kitchenQueueModel";

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
      await updateOrderService(order, existingOrder);
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
      io.emit("tableStatus", updateTable);

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

const updateOrderService = async (order: Order, existingOrder: any) => {
  const io = getIo();
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
        io.emit("newKitchenQueue");

        existingOrder.totalPrice += newItem.price;
      } else {
        const created = await OrderItemModel.create({
          orderId: existingOrder._id,
          itemId: new mongoose.Types.ObjectId(newItem.itemId),
          quantity: newItem.quantity,
          price: newItem.price,
        });

        newOrderItemIds.push(created._id);
        const kitchenEntry = await KitchenQueueModel.create({
          orderItemId: created._id,
        });
        io.emit("newKitchenQueue", kitchenEntry);
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

export const updateOrderStatusService = async (
  orderId: string,
  status: string
) => {
  const io = getIo();
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (status === "CONFIRMED") {
      const orderItems = await OrderItemModel.find({ orderId });
      const kitchenEntries = orderItems.map((item) => ({
        orderItemId: item._id,
      }));
      await KitchenQueueModel.insertMany(kitchenEntries);

      io.emit("newKitchenQueue");
    }
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    return updatedOrder;
  } catch (error: any) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
};

export const getOrderByIdService = async (orderId: string) => {
  try {
    const order = await OrderModel.findById(orderId).populate("items");
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  } catch (error: any) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

export const getAllOrdersService = async () => {
  try {
    const orders = await OrderModel.find().populate("items");
    return orders;
  } catch (error: any) {
    throw new Error(`Error fetching all orders: ${error.message}`);
  }
};

export const deleteOrderService = async (orderId: string) => {
  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      throw new Error("Order not found");
    }
    return deletedOrder;
  } catch (error: any) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};

export const getOrdersByUserIdService = async (userId: string) => {
  try {
    const orders = await OrderModel.find({ userId }).populate("items");
    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this user");
    }
    return orders;
  } catch (error: any) {
    throw new Error(`Error fetching orders for user: ${error.message}`);
  }
};

export const getOrdersByTableIdService = async (tableId: string) => {
  try {
    const orders = await OrderModel.find({ tableId }).populate("items");
    if (!orders || orders.length === 0) {
      throw new Error("No orders found for this table");
    }
    return orders;
  } catch (error: any) {
    throw new Error(`Error fetching orders for table: ${error.message}`);
  }
};

export const deleteOrderItemService = async (orderItemId: string) => {
  const io = getIo();
  try {
    const item = await OrderItemModel.findOneAndDelete({
      _id: orderItemId,
      status: "PENDING",
    });
    if (!item) {
      throw new Error(
        "Order item not found or cannot be deleted (not PENDING)"
      );
    }
    await KitchenQueueModel.findOneAndDelete({ orderItemId });
    io.emit("newKitchenQueue");
    return item;
  } catch (error: any) {
    throw new Error(`Error deleting order item: ${error.message}`);
  }
};
