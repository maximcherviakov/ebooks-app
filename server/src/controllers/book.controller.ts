import path from "path";

import { Request, Response } from "express";
import Book from "../models/book.model";
import { ICreateBookRequest, IBook, ICommonRequest } from "../types/type";
import generateThumbnail from "../utils/generateThumbnail";
import { uploadedBooksPath, uploadedThumbnailsPath } from "../config/envconfig";
import { deleteFile } from "../utils/FileHelper";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books: IBook[] = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate("user", "username");

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error });
  }
};

export const getBookThumbnail = async (req: Request, res: Response) => {
  try {
    const { thumbnailName } = req.params;    
    res.sendFile(path.join(process.cwd(), uploadedThumbnailsPath, thumbnailName));
  } catch (error) {
    res.status(500).json({ message: "Error fetching thumbnail", error });
  }
};

export const getBookFile = async (req: Request, res: Response) => {
  try {
    const { bookName } = req.params;
    res.sendFile(path.join(process.cwd(), uploadedBooksPath, bookName));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book file", error });
  }
};

export const createBook = async (req: ICreateBookRequest, res: Response) => {
  try {
    const { title, description, author } = req.body;

    // Validate required fields
    if (!title || !description || !author) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (!req.files || req.files.length === 0) {
      res.status(400).json({ message: "File is required" });
      return;
    }

    const bookFile = (req.files as any)[0];

    // Define thumbnail name
    const bookFilename = bookFile.filename;
    const thumbnailFilename = path.parse(bookFilename).name;

    // Generate thumbnail from PDF
    const thumbnailName = await generateThumbnail(
      bookFilename,
      thumbnailFilename
    );

    // Create new Book document
    const newBook = new Book({
      title,
      description,
      author,
      bookName: bookFilename,
      thumbnailName: thumbnailName,
      user: req.user?._id, // Associate with authenticated user
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error creating book", error });
  }
};

export const updateBook = async (req: ICreateBookRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, author } = req.body;
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Check if the authenticated user is the owner of the book
    if (req.user?._id.toString() !== book.user.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    let bookFilename = undefined;
    let thumbnailName = undefined;

    if (req.files && req.files.length !== 0) {
      const bookFile = (req.files as any)[0];

      // Define thumbnail name
      bookFilename = bookFile.filename;
      const thumbnailFilename = path.parse(bookFilename).name;

      // Generate thumbnail from PDF
      thumbnailName = await generateThumbnail(bookFilename, thumbnailFilename);

      // Delete old files
      deleteFile(path.join(uploadedBooksPath, book.bookName));
      deleteFile(path.join(uploadedThumbnailsPath, book.thumbnailName));
    }

    book.title = title || book.title;
    book.description = description || book.description;
    book.author = author || book.author;
    book.bookName = bookFilename || book.bookName;
    book.thumbnailName = thumbnailName || book.thumbnailName;

    await book.save();
    res.json(book);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error updating book", error });
  }
};

export const deleteBook = async (req: ICommonRequest, res: Response) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    // Define file names
    const bookFilename = book.bookName;
    const thumbnailFilename = book.thumbnailName;

    // Check if the authenticated user is the owner of the book
    if (req.user?._id.toString() !== book.user.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    // Delete book document
    deleteFile(path.join(uploadedBooksPath, bookFilename));

    // Delete thumbnail
    deleteFile(path.join(uploadedThumbnailsPath, thumbnailFilename));

    // Delete book document from database
    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error deleting book", error });
  }
};
