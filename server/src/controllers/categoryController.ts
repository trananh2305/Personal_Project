import { Request, Response } from "express";
import { Category } from "../types/category";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  updateCategoryService,
} from "../services/categoryService";
import CategoryModel from "../models/category/categoryModel";
import { get } from "http";

export const createCategory = async (
  req: Request<unknown, unknown, Category>,
  res: Response
) => {
  try {
    const category = req.body;
    const newCategory = await createCategoryService(category);
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    throw new Error(
      `Error creating category: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateCategory = async (
  req: Request<{ id: string }, unknown, Category>,
  res: Response
) => {
  const { id } = req.params;
  const categoryData = req.body;

  try {
    const updatedCategory = await updateCategoryService(id, categoryData);
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    const deletedCategory = await deleteCategoryService(id);
    res.status(200).json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
