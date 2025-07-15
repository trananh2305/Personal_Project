import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    }, {
    timestamps: true,
})

const CategoryModel = mongoose.model("Category", categorySchema);

export default CategoryModel;