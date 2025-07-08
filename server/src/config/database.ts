import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    console.log('ENV DB_URL:', process.env.DB_URL)

    await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/FOrder");

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
