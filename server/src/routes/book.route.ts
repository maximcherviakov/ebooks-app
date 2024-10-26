import express from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";
import { authenticate } from "../middlewares/auth";
import upload from "../middlewares/upload";

const router = express.Router();

const uploadFields = upload.any();

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", authenticate, uploadFields, createBook);
router.put("/:id", authenticate, uploadFields, updateBook);
router.delete("/:id", authenticate, deleteBook);

export default router;
