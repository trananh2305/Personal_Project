import { Request, Response } from "express";
import {
  getAllBillService,
  getBillByIdService,
  requestBillService,
  updateBillService,
} from "../services/billService";

export const requestBill = async (req: Request, res: Response) => {
  const { orderId, discont } = req.body;

  try {
    const bill = await requestBillService(orderId, discont);
    res.status(201).json({ message: "Bill payment", bill });
  } catch (error: any) {
    throw new Error(
      `Error creating bill: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const updateBill = async (req: Request, res: Response) => {
  const { tableId } = req.body;
  const { id } = req.params;

  try {
    const updateBill = await updateBillService(id, tableId);
    res.status(201).json({ message: "Update bill payment", updateBill });
  } catch (error: any) {
    throw new Error(
      `Error update bill: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getBillById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bill = await getBillByIdService(id);
    res.status(201).json({ message: "Bill payment", bill });
  } catch (error: any) {
    throw new Error(
      `Error find bill: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getAllBill = async (req: Request, res: Response) => {
  try {
    const bills = await getAllBillService();
    res.status(201).json({ message: "All bill payment", bills });
  } catch (error: any) {
    throw new Error(
      `Error find bill: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
