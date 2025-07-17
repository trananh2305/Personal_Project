
import mongoose from "mongoose";

const orderModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETED",
        "CANCELED",
        "IN_PROGRESS",
        "CONFIRMED",
        "SERVED",
      ],
      default: "PENDING",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

  },
  { timestamps: true }
);
 const OrderModel = mongoose.model("Order", orderModel);
 export default OrderModel;
