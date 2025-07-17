import express from "express";
import { createOrder } from "../controllers/orderController";


const router = express.Router();

router.route("/").post(createOrder);


export default router;
