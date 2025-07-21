import DiscountModel from "../models/discount/discountModel";
import { Discount } from "../types/discount";


export const createDiscountService = async (discount: Discount) => {
    try {
        const newDiscount = await DiscountModel.create(discount);
        if (!newDiscount) {
            throw new Error("Failed to create discount");
        }
        return newDiscount;
    } catch (error: any) {
        throw new Error(`Error creating discount: ${error.message}`);
        
    }
}

export const getAllDiscountsService = async () => {
    try {
        const discounts = await DiscountModel.find().populate("userUsed", "name email");
        return discounts;
    } catch (error: any) {
        throw new Error(`Error fetching discounts: ${error.message}`);
    }
}

export const getDiscountByIdService = async (id: string) => {
    try {
        const discount = await DiscountModel.findById(id)
        if (!discount) {
            throw new Error("Discount not found");
        }
        return discount;
    } catch (error: any) {
        throw new Error(`Error fetching discount by ID: ${error.message}`);
    }
}

export const updateDiscountService = async (id: string, discountData: Partial<Discount>) => {
    try {
        const updatedDiscount = await DiscountModel.findByIdAndUpdate(id, discountData, { new: true });
        if (!updatedDiscount) {
            throw new Error("Failed to update discount");
        }
        return updatedDiscount;
    } catch (error: any) {
        throw new Error(`Error updating discount: ${error.message}`);
    }
}
export const deleteDiscountService = async (id: string) => {
    try {
        const deletedDiscount = await DiscountModel.findByIdAndDelete(id);
        if (!deletedDiscount) {
            throw new Error("Failed to delete discount");
        }
        return deletedDiscount;
    } catch (error: any) {
        throw new Error(`Error deleting discount: ${error.message}`);
    }
}