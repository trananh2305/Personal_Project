import { Request, Response } from "express";
import { DishRes } from "../types/dish";
import {
  createDishService,
  deleteDishService,
  getAllDishesService,
  getDishByIdService,
  updateDishService,
} from "../services/dishService";

export const createDish = async (
  req: Request<unknown, unknown, DishRes>,
  res: Response
) => {
  try {
    const dish = {
      ...req.body,
      image: req.file?.buffer,
    };
    const newDish = await createDishService(dish);
    res.status(201).json({
      message: "Dish created successfully",
      dish: newDish,
    });
  } catch (error) {
    throw new Error(
      `Error creating dish: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getAllDishes = async (req: Request, res: Response) => {
  try {
    const dishes = await getAllDishesService();
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dishes",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getDishById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const dish = await getDishByIdService(id);
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching dish",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const updateDish = async (
  req: Request<{ id: string }, unknown, DishRes>,
  res: Response
) => {
  const { id } = req.params;
  const dishData = {
    ...req.body,
    image: req.file?.buffer,
  };



  try {
    const updatedDish = await updateDishService(id, dishData);
    res.status(200).json({
      message: "Dish updated successfully",
      dish: updatedDish,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating dish",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const deleteDish = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const deletedDish = await deleteDishService(id);
    res.status(200).json({
      message: "Dish deleted successfully",
      dish: deletedDish,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting dish",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
