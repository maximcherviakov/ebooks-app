import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT;

export const uploadedBooksPath = process.env.UPLOADED_BOOKS_PATH;
export const uploadedThumbnailsPath = process.env.UPLOADED_THUMBNAILS_PATH;

export const mongoUri = process.env.MONGO_URI;

export const jwtSecretKey = process.env.JWT_SECRET_KEY;
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
