import mongoose from "mongoose";

const kitchenQueueSchema = new mongoose.Schema(
  {
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
      unique: true, 
    }
  },
  { timestamps: true }
);

const KitchenQueueModel = mongoose.model("KitchenQueue", kitchenQueueSchema);
export default KitchenQueueModel;