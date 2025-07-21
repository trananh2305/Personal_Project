import KitchenQueueModel from "../models/kitchenQueue/kitchenQueueModel";
import OrderItemModel from "../models/order/orderItemModel";
import { getIo } from "../socket";

export const assignChefForOrderItemService = async (
  orderItemId: string,
  chefId: string
) => {
  const io = getIo();
  try {
    const updatedOrderItem = await OrderItemModel.findByIdAndUpdate(
      orderItemId,
      { chefId, status: "PROCCESSING" },
      { new: true }
    );
    if (!updatedOrderItem) {
      throw new Error("Order item not found");
    }
    io.emit("orderItemUpdated", updatedOrderItem);
    return updatedOrderItem;
  } catch (error: any) {
    throw new Error(`Error assigning chef for order item: ${error.message}`);
  }
};

export const getAllKitchenQueueService = async () => {
  try {
    const kitchenQueue = await KitchenQueueModel.find().populate("orderItemId");
    return kitchenQueue;
  } catch (error: any) {
    throw new Error(`Error fetching kitchen queue: ${error.message}`);
  }
};

export const updateStatusInKitchenQueueService = async (
  orderItemId: string,
  status: string
) => {
  const io = getIo();
  try {
    const updatedOrderItem = await OrderItemModel.findByIdAndUpdate(
      orderItemId,
      { status },
      { new: true }
    );

    if (!updatedOrderItem) {
      throw new Error("Order item not found");
    }
    if (status === "SERVED") {
      // Remove the order item from the kitchen queue
      await KitchenQueueModel.findOneAndDelete({
        orderItemId: updatedOrderItem._id,
      });
    }
    // Emit the updated order item to the kitchen queue
    io.emit("orderItemStatusUpdated");

    return updatedOrderItem;
  } catch (error: any) {
    throw new Error(
      `Error updating order item status in kitchen queue: ${error.message}`
    );
  }
};
