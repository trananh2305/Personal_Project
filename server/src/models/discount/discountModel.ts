import mongoose from "mongoose";
import { ref } from "process";

const discountModel = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    limit: {
        type: Number,
        required: false,
        default: 0, // Default to no limit
    },
    maxValue: {
        type: Number,
        required: false,
        default: 0, // Default to no maximum value
    },
    userUsed: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User", // Reference to User model
        required: false,
        default: [], 
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    }, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    });

const DiscountModel = mongoose.model("Discount", discountModel);
export default DiscountModel;