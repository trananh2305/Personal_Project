import express from "express";
import { createDish, deleteDish, getAllDishes, getDishById, updateDish } from "../controllers/dishController";

const router = express.Router();

router.route("/").post(createDish);
router.route("/").get(getAllDishes);
router.route("/:id").get(getDishById);
router.route("/:id").put(updateDish);
router.route("/:id").delete(deleteDish);

export default router;
