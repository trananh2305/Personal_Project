import mongoose from "mongoose";
import { User } from "../types/user";

const userSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    role: {
      type: String,
      enum: ["admin", "user", "chef", "waiter"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
