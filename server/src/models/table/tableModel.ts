import mongoose from "mongoose";

const tableModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    qrCode: {
      type: String,
      default: "",
      require: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    public_id: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["OCCUPIED", "UNOCCUPIED"],
      default: "UNOCCUPIED",
    },
  },
  {
    timestamps: true,
  }
);
const TableModel = mongoose.model("Table", tableModel);
export default TableModel;

