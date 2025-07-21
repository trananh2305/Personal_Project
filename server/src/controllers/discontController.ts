import { Request, Response } from "express";
import {
  createDiscountService,
  deleteDiscountService,
  getAllDiscountsService,
  getDiscountByIdService,
  updateDiscountService,
} from "../services/discountService";
import { Discount } from "../types/discount";

export const createDiscont = async (req: Request, res: Response) => {
  try {
    const discontData = req.body;
    const newDiscont = await createDiscountService(discontData);
    res.status(201).json(newDiscont);
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating discont",
      error: error.message,
    });
  }
};

export const getAllDisconts = async (req: Request, res: Response) => {
  try {
    const disconts = await getAllDiscountsService();
    res.status(200).json(disconts);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching disconts",
      error: error.message,
    });
  }
};

export const getDiscontById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const discont = await getDiscountByIdService(id);
    res.status(200).json(discont);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching discont",
      error: error.message,
    });
  }
};

export const updateDiscont = async (
  req: Request<{ id: string }, unknown, Partial<Discount>>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const discontData = req.body;
    const updatedDiscont = await updateDiscountService(id, discontData);
    res.status(200).json(updatedDiscont);
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating discont",
      error: error.message,
    });
  }
};

export const deleteDiscont = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedDiscont = await deleteDiscountService(id);
    res.status(200).json({
      message: "Discont deleted successfully",
      discont: deletedDiscont,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting discont",
      error: error.message,
    });
  }
};
