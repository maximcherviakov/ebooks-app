import dotenv from "dotenv";

dotenv.config();

export const port = process.env.BACKEND_PORT;
export const frontendUrl = `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`;

export const uploadedBooksPath = process.env.BACKEND_UPLOADED_BOOKS_PATH;
export const uploadedThumbnailsPath = process.env.BACKEND_UPLOADED_THUMBNAILS_PATH;

export const mongoHost = process.env.MONGO_HOST;
export const mongoPort = process.env.MONGO_PORT;
export const mongoDB = process.env.MONGO_DB;
export const mongoUser = process.env.MONGO_USER;
export const mongoPass = process.env.MONGO_PASS;
export const mongoUri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDB}?authSource=${mongoDB}`;

export const jwtSecretKey = process.env.BACKEND_JWT_SECRET_KEY;
export const jwtExpiresIn = process.env.BACKEND_JWT_EXPIRES_IN;
