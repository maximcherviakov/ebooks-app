import dotenv from "dotenv";

// Load environment variables from a `.env` file
dotenv.config();

export const config = {
  // baseUrl: process.env.BASE_URL || "http://localhost",
  baseUrl: process.env.BASE_URL || "http://proxy",
  // baseUrl: process.env.BASE_URL || "http://client:3000",
};
