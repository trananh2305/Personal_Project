import { Request, Response } from "express";
import { createOrderService } from "../services/orderService";
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
