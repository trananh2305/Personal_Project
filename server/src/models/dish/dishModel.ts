import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
    imageUrl: { type: String, required: false },
    imagePublicId: { type: String, required: false },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
    }, {
    timestamps: true,
})

const DishModel = mongoose.model("Dish", dishSchema);

export default DishModel;