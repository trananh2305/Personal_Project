import { Request, Response } from "express";
import {
  assignChefForOrderItemService,
  getAllKitchenQueueService,
  updateStatusInKitchenQueueService,
} from "../services/kitchenService";

export const assignChefForOrderItem = async (
  req: Request<{ id: string }, unknown, { chefId: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { chefId } = req.body;
    const updatedOrderItem = await assignChefForOrderItemService(id, chefId);
    res.status(200).json({
      message: "Chef assigned successfully",
      orderItem: updatedOrderItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error assigning chef for order item",
      error: error.message,
    });
  }
};

export const getAllKitchenQueue = async (req: Request, res: Response) => {
  try {
    const kitchenQueue = await getAllKitchenQueueService();
    res.status(200).json({
      message: "Kitchen queue fetched successfully",
      kitchenQueue,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching kitchen queue",
      error: error.message,
    });
  }
};

export const updateStatusInKitchenQueue = async (
  req: Request<{ id: string }, unknown, { status: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrderItem = await updateStatusInKitchenQueueService(
      id,
      status
    );
    res.status(200).json({
      message: "Order item status updated successfully",
      orderItem: updatedOrderItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating order item status in kitchen queue",
      error: error.message,
    });
  }
};
