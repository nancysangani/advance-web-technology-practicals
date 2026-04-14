import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri: string = process.env.MONGO_URI || "";

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected!");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;
