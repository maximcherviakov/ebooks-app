import dotenv from "dotenv";

// Load environment variables from a `.env` file
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || "http://localhost",
};
