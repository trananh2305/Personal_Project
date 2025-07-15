import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    }, {
    timestamps: true,
})

const IngredientModel = mongoose.model("Ingredient", ingredientSchema);

export default IngredientModel;