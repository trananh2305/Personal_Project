import express from "express";
import {
  getAllBill,
  getBillById,
  requestBill,
  updateBill,
} from "../controllers/billController";

const router = express.Router();

router.route("/").post(requestBill).get(getAllBill);
router.route("/:id").get(getBillById).put(updateBill);

export default router;
