import express from "express";
import {
  getBooks,
  getBook,
  getBookThumbnail,
  getBookFile,
  createBook,
  updateBook,
  deleteBook,
  getBookGenres,
} from "../controllers/book.controller";
import { authenticate } from "../middlewares/auth";
import upload from "../middlewares/upload";

const router = express.Router();

const uploadFields = upload.any();

router.get("/", getBooks);
router.get("/book/:id", getBook);
router.get("/thumbnail/:thumbnailName", getBookThumbnail);
router.get("/file/:bookName", getBookFile);
router.get("/genres", getBookGenres);
router.post("/", authenticate, uploadFields, createBook);
router.put("/:id", authenticate, uploadFields, updateBook);
router.delete("/:id", authenticate, deleteBook);

export default router;
