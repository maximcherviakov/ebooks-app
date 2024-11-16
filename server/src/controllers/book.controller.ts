import path from "path";

import { Request, Response } from "express";
import Book from "../models/book.model";
import {
  ICreateBookRequest,
  IBook,
  ICommonRequest,
  IQueryParams,
  IPaginatedResponse,
  IGetBooksRequest,
} from "../types/type";
import generateThumbnail from "../utils/generateThumbnail";
import { uploadedBooksPath, uploadedThumbnailsPath } from "../config/envconfig";
import { deleteFile } from "../utils/FileHelper";
import Genre from "../models/genre.model";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../config/consts";
import { Types } from "mongoose";

export const getBooks = async (req: IGetBooksRequest, res: Response) => {
  try {
    // Extract query parameters
    const {
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      genre,
      author,
      year,
    } = req.query;
    
    const page = req.query.page ? parseInt(req.query.page) : DEFAULT_PAGE;
    const limit = req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT;

    // Pagination parameters
    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = {};

    // Search functionality (searching in title, description, and author)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // Genre filtering
    if (genre && Types.ObjectId.isValid(genre)) {
      query.genres = new Types.ObjectId(genre);
    }

    // Author filter
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    // Published year filter
    if (year) {
      query.year = year;
    }

    // Build sort object
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const books: IBook[] = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("genres", "name");

    // Calculate pagination metadata
    const totalBooks = books.length;
    const totalPages = Math.ceil(totalBooks / limit);    

    // Prepare response
    const response: IPaginatedResponse = {
      books,
      metadata: {
        currentPage: page,
        totalPages,
        totalBooks
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id)
      .populate("user", "username")
      .populate("genres", "name");

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
    res.sendFile(
      path.join(process.cwd(), uploadedThumbnailsPath, thumbnailName)
    );
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

export const getBookGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genres", error });
  }
};

export const createBook = async (req: ICreateBookRequest, res: Response) => {
  try {
    const { title, description, author, year, genres } = req.body;

    console.log(req.body);

    // Validate required fields
    if (
      !title ||
      !description ||
      !author ||
      !year ||
      !genres ||
      genres?.length === 0
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Validate genres
    const genreIds = await Genre.find({ name: { $in: genres } }).select("_id");
    if (genreIds.length !== genres.length) {
      res.status(400).json({ message: "Some genres are invalid" });
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
      year,
      genres: genreIds.map((genre: any) => genre._id),
      bookFileName: bookFilename,
      thumbnailFileName: thumbnailName,
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
    const { title, description, author, year, genres } = req.body;
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
    let thumbnailFileName = undefined;

    if (req.files && req.files.length !== 0) {
      const bookFile = (req.files as any)[0];

      // Define thumbnail name
      bookFilename = bookFile.filename;
      const thumbnailFilename = path.parse(bookFilename).name;

      // Generate thumbnail from PDF
      thumbnailFileName = await generateThumbnail(
        bookFilename,
        thumbnailFilename
      );

      // Delete old files
      deleteFile(path.join(uploadedBooksPath, book.bookFileName));
      deleteFile(path.join(uploadedThumbnailsPath, book.thumbnailFileName));
    }

    const genreIds = await Genre.find({ name: { $in: genres } }).select("_id");
    if (genreIds.length !== genres.length) {
      res.status(400).json({ message: "Some genres are invalid" });
      return;
    }

    book.title = title || book.title;
    book.description = description || book.description;
    book.author = author || book.author;
    book.year = year || book.year;
    book.genres = genreIds.map((genre: any) => genre._id) || book.genres;
    book.bookFileName = bookFilename || book.bookFileName;
    book.thumbnailFileName = thumbnailFileName || book.thumbnailFileName;

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
    const bookFilename = book.bookFileName;
    const thumbnailFilename = book.thumbnailFileName;

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
