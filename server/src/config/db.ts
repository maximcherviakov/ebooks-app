import mongoose from "mongoose";
import { mongoUri } from "./envconfig";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(
      `MongoDB connected: ${conn.connection.host}:${conn.connection.port}`
    );
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
};
