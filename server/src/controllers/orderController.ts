import e, { Request, Response } from "express";
import {
  createOrderService,
  deleteOrderItemService,
  deleteOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByTableIdService,
  getOrdersByUserIdService,
  updateOrderStatusService,
} from "../services/orderService";
import { Order } from "../types/order";

export const createOrder = async (
  req: Request<unknown, unknown, Order>,
  res: Response
) => {
  try {
    const order = req.body;
    const newOrder = await createOrderService(order);
    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {}
};

export const updateOrderStatus = async (
  req: Request<{ id: string; status: string }, unknown, Order>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const order = req.body;
    const updatedStatus = await updateOrderStatusService(id, order.status);
    res.status(200).json({
      message: "Order updated successfully",
      order: updatedStatus,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
};

export const getOrderById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
}

export const getAllOrders = async (
  req: Request,
  res: Response
) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching all orders",
      error: error.message,
    });
  }
}

export const deleteOrderById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await deleteOrderService(id);
    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting order",
      error: error.message,
    });
  }
}

export const getOrdersByUserId = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const orders = await getOrdersByUserIdService(userId);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching orders for user",
      error: error.message,
    });
  }
}

export const getOrdersByTableId = async (
  req: Request<{ tableId: string }>,
  res: Response
) => {
  try {
    const { tableId } = req.params;
    const orders = await getOrdersByTableIdService(tableId);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching orders for table",
      error: error.message,
    });
  }
}

export const deleteOrderItemById = async (
  req: Request<{ orderItemId: string}>,
  res: Response
) => {
  try {
    const { orderItemId } = req.params;
    const orderItem = await deleteOrderItemService(orderItemId);
    res.status(200).json({
      message: "Order item deleted successfully",
      orderItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting order item",
      error: error.message,
    });
  }
}