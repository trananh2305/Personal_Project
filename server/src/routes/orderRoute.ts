import express from "express";
import {
  createOrder,
  deleteOrderById,
  deleteOrderItemById,
  getAllOrders,
  getOrderById,
  getOrdersByTableId,
  getOrdersByUserId,
  updateOrderStatus,
} from "../controllers/orderController";

const router = express.Router();

router.route("/").post(createOrder).get(getAllOrders);
router
  .route("/:id")
  .put(updateOrderStatus)
  .get(getOrderById)
  .delete(deleteOrderById);
router.route("/user/:userId").get(getOrdersByUserId);
router.route("/table/:tableId").get(getOrdersByTableId);
router.route("/item/:orderItemId").delete(deleteOrderItemById);

export default router;
