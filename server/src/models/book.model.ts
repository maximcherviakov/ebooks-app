import { model, Model, Schema } from "mongoose";
import { IBook } from "../types/type";

type BookModel = Model<IBook>;

const bookSchema = new Schema<IBook, BookModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    bookFileName: {
      type: String,
      required: true,
    },
    thumbnailFileName: {
      type: String,
    },
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Book = model<IBook, BookModel>("Book", bookSchema);

export default Book;
