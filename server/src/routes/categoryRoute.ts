import express from "express";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/categoryController";

const router = express.Router();

router.route("/").post(createCategory);
router.route("/").get(getAllCategory);
router.route("/:id").put(updateCategory);
router.route('/:id').delete(deleteCategory);

export default router;
