import express from "express";
import {
  assignChefForOrderItem,
  getAllKitchenQueue,
  updateStatusInKitchenQueue,
} from "../controllers/kitchenController";

const router = express.Router();

router.route("/:id").put(assignChefForOrderItem);
router.route("/:id/status").put(updateStatusInKitchenQueue);
router.route("/").get(getAllKitchenQueue);


export default router;
