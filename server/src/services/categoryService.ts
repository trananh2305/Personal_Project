import CategoryModel from "../models/category/categoryModel";
import { Category } from "../types/category";

export const createCategoryService = async (category: Category) => {
  try {
    const newCategory = await CategoryModel.create(category);
    if (!newCategory) {
      throw new Error("Category creation failed");
    }
    return newCategory;
  } catch (error) {
    throw new Error(
      "Error creating category: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw new Error(
      "Error fetching category: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const updateCategoryService = async (id: string, categoryData: Category) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      categoryData,
      { new: true }
    );
    if (!updatedCategory) {
      throw new Error("Category update failed");
    }
    return updatedCategory;
  } catch (error) {
    throw new Error(
      "Error updating category: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const deleteCategoryService = async (id: string) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      throw new Error("Category deletion failed");
    }
    return deletedCategory;
  } catch (error) {
    throw new Error(
      "Error deleting category: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};

export const getAllCategoriesService = async () => {
  try {
    const categories = await CategoryModel.find();
    return categories;
  } catch (error) {
    throw new Error(
      "Error fetching categories: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};
