import CategoryModel from "../models/category/categoryModel";
import DishModel from "../models/dish/dishModel";
import { DishRes } from "../types/dish";
import { deleteImage, updateImage, uploadImage } from "./uploadImage";

export const createDishService = async (dish: DishRes) => {
  try {
    const existingCategory = await CategoryModel.findById(dish.categoryId);
    if (!existingCategory) {
      throw new Error("Category not found");
    }
    const payload: any = { ...dish };
    if (dish.image) {
      const { url, public_id } = await uploadImage(dish.image, "dishes");
      payload.imageUrl = url;
      payload.imagePublicId = public_id;
      //  Xóa buffer để giải phóng RAM
      dish.image = undefined;
    }

    const newDish = await DishModel.create(payload);
    if (!newDish) {
      throw new Error("Dish creation failed");
    }
    return newDish;
  } catch (error) {
    throw new Error(
      `Error creating dish: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getAllDishesService = async () => {
  try {
    const dishes = await DishModel.find().populate("categoryId", "name");
    return dishes;
  } catch (error) {
    throw new Error(
      `Error fetching dishes: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
export const getDishByIdService = async (id: string) => {
  try {
    const dish = await DishModel.findById(id).populate("categoryId", "name");
    if (!dish) {
      throw new Error("Dish not found");
    }
    return dish;
  } catch (error) {
    throw new Error(
      `Error fetching dish: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
export const updateDishService = async (id: string, dishData: DishRes) => {
  try {
    const existingDish = await DishModel.findById(id);
    if (!existingDish) {
      throw new Error("Dish not found");
    }
    const payload: any = { ...dishData };
    if (dishData.image) {
      let url, public_id;
      if (existingDish.imagePublicId) {
        ({ url, public_id } = await updateImage(
          existingDish.imagePublicId,
          dishData.image,
          "dishes"
        ));
      } else {
        ({ url, public_id } = await uploadImage(dishData.image, "dishes"));
      }
      payload.imageUrl = url;
      payload.imagePublicId = public_id;
      dishData.image = undefined;
    }

    const updatedDish = await DishModel.findByIdAndUpdate(id, payload, {
      new: true,
    }).populate("categoryId", "name");
    if (!updatedDish) {
      throw new Error("Dish update failed");
    }
    return updatedDish;
  } catch (error) {
    throw new Error(
      `Error updating dish: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const deleteDishService = async (id: string) => {
  try {
    const dish = await DishModel.findById(id);
    if (!dish) {
      throw new Error("Dish not found");
    }
    if (dish.imagePublicId) {
      await deleteImage(dish.imagePublicId);
    }
    const deletedDish = await DishModel.findByIdAndDelete(id);
    if (!deletedDish) {
      throw new Error("Dish deletion failed");
    }
    return deletedDish;
  } catch (error) {
    throw new Error(
      `Error deleting dish: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
