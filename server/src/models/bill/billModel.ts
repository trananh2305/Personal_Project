import mongoose from "mongoose";

const billModel = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    require: true,
    unique: true,
  },
  discountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Discount",
    require: false
  },
  lastPayment: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: false
  }
},{
    timestamps: true
});

const BillModel = mongoose.model("Bill", billModel);
export default BillModel;