import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import path from "path";
import Book from "../../src/models/book.model";
import Genre from "../../src/models/genre.model";
import * as bookController from "../../src/controllers/book.controller";
import generateThumbnail from "../../src/utils/generateThumbnail";
import { deleteFile } from "../../src/utils/FileHelper";
import {
  uploadedBooksPath,
  uploadedThumbnailsPath,
} from "../../src/config/envconfig";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../../src/config/consts";

// filepath: server/src/controllers/book.controller.test.ts

// Import models, utils, and controller functions

// Mock dependencies
jest.mock("../../src/models/book.model");
jest.mock("../../src/models/genre.model");
jest.mock("../../src/utils/generateThumbnail");
jest.mock("../../src/utils/FileHelper");
jest.mock("path", () => ({
  resolve: jest.fn().mockReturnValue("/mocked/path"),
  join: jest.fn().mockImplementation((...args) => args.join("/")),
  parse: jest
    .fn()
    .mockImplementation((filename) => ({ name: filename.split(".")[0] })),
}));

describe("Book Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendFile: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getBooks", () => {
    it("should return paginated books with default pagination", async () => {
      // Arrange
      const mockBooks = [{ title: "Book 1" }, { title: "Book 2" }];
      const mockCount = 2;
      mockRequest.query = {};

      (Book.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockCount);

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        books: mockBooks,
        metadata: {
          currentPage: DEFAULT_PAGE,
          totalPages: 1,
          totalBooks: mockCount,
        },
      });
    });

    it("should handle search and filtering parameters", async () => {
      // Arrange
      mockRequest.query = {
        search: "Test",
        genre: new Types.ObjectId().toString(),
        author: "Author",
        year: "2023",
        page: "2",
        limit: "5",
        sortBy: "title",
        sortOrder: "asc",
      };

      const mockBooks = [{ title: "Test Book" }];

      (Book.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(1);

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(Book.find).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      // Arrange
      mockRequest.query = {};
      const errorMessage = "Database error";
      (Book.find as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Error fetching books" })
      );
    });
  });

  describe("getUserBooks", () => {
    it("should return books for the authenticated user", async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const mockBooks = [{ title: "User Book 1" }, { title: "User Book 2" }];
      mockRequest.user = { _id: userId };

      (Book.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      // Act
      await bookController.getUserBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ books: mockBooks });
      expect(Book.find).toHaveBeenCalledWith({ user: userId });
    });

    it("should handle errors", async () => {
      // Arrange
      mockRequest.user = { _id: new Types.ObjectId() };
      (Book.find as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      // Act
      await bookController.getUserBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  //   describe("getBook", () => {
  //     it("should return a book by ID", async () => {
  //       // Arrange
  //       const bookId = new Types.ObjectId().toString();
  //       const mockBook = { title: "Test Book", author: "Test Author" };
  //       mockRequest.params = { id: bookId };

  //       (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(true);
  //       (Book.findById as jest.Mock).mockReturnValue({
  //         populate: jest.fn().mockReturnThis(),
  //         populate: jest.fn().mockResolvedValue(mockBook),
  //       });

  //       // Act
  //       await bookController.getBook(
  //         mockRequest as Request,
  //         mockResponse as Response
  //       );

  //       // Assert
  //       expect(mockResponse.status).toHaveBeenCalledWith(200);
  //       expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
  //     });

  //     it("should return 400 for invalid ID", async () => {
  //       // Arrange
  //       mockRequest.params = { id: "invalid-id" };
  //       (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(false);

  //       // Act
  //       await bookController.getBook(
  //         mockRequest as Request,
  //         mockResponse as Response
  //       );

  //       // Assert
  //       expect(mockResponse.status).toHaveBeenCalledWith(400);
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         message: "Invalid book ID",
  //       });
  //     });

  //     it("should return 404 when book not found", async () => {
  //       // Arrange
  //       const bookId = new Types.ObjectId().toString();
  //       mockRequest.params = { id: bookId };

  //       (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(true);
  //       (Book.findById as jest.Mock).mockReturnValue({
  //         populate: jest.fn().mockReturnThis(),
  //         populate: jest.fn().mockResolvedValue(null),
  //       });

  //       // Act
  //       await bookController.getBook(
  //         mockRequest as Request,
  //         mockResponse as Response
  //       );

  //       // Assert
  //       expect(mockResponse.status).toHaveBeenCalledWith(404);
  //     });
  //   });

  //   describe("createBook", () => {
  //     it("should create a new book with valid data", async () => {
  //       // Arrange
  //       const userId = new Types.ObjectId();
  //       const mockGenres = [{ _id: new Types.ObjectId() }];
  //       const mockBook = {
  //         title: "New Book",
  //         author: "Author",
  //         year: 2023,
  //         genres: ["Fiction"],
  //       };
  //       const mockSavedBook = { ...mockBook, _id: new Types.ObjectId() };

  //       mockRequest.body = mockBook;
  //       mockRequest.user = { _id: userId };
  //       mockRequest.files = [{ filename: "book.pdf" }];

  //       (Genre.find as jest.Mock).mockReturnValue({
  //         select: jest.fn().mockResolvedValue(mockGenres),
  //       });

  //       (generateThumbnail as jest.Mock).mockResolvedValue("thumbnail.jpg");

  //       (Book.prototype.save as jest.Mock) = jest
  //         .fn()
  //         .mockResolvedValue(mockSavedBook);

  //       // Act
  //       await bookController.createBook(
  //         mockRequest as any,
  //         mockResponse as Response
  //       );

  //       // Assert
  //       expect(Book).toHaveBeenCalledWith(
  //         expect.objectContaining({
  //           title: mockBook.title,
  //           author: mockBook.author,
  //           user: userId,
  //         })
  //       );
  //       expect(mockResponse.status).toHaveBeenCalledWith(201);
  //       expect(mockResponse.json).toHaveBeenCalledWith(mockSavedBook);
  //     });

  //     it("should return 400 when required fields are missing", async () => {
  //       // Arrange
  //       mockRequest.body = { title: "New Book" }; // Missing required fields

  //       // Act
  //       await bookController.createBook(
  //         mockRequest as any,
  //         mockResponse as Response
  //       );

  //       // Assert
  //       expect(mockResponse.status).toHaveBeenCalledWith(400);
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         message: "All fields are required",
  //       });
  //     });
  //   });

  describe("updateBook", () => {
    it("should update book with valid data", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId();
      const mockBook = {
        _id: bookId,
        title: "Old Title",
        user: userId,
        bookFileName: "old.pdf",
        thumbnailFileName: "old.jpg",
        save: jest.fn().mockResolvedValue({}),
      };

      mockRequest.params = { id: bookId };
      mockRequest.user = { _id: userId };
      mockRequest.body = {
        title: "Updated Title",
        genres: ["Fiction"],
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);
      (Genre.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: new Types.ObjectId() }]),
      });

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockBook.title).toBe("Updated Title");
      expect(mockBook.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should return 404 if book not found", async () => {
      // Arrange
      mockRequest.params = { id: new Types.ObjectId().toString() };
      mockRequest.user = { _id: new Types.ObjectId() };

      (Book.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book not found",
      });
    });

    it("should return 403 if user is not authorized", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      const bookOwnerId = new Types.ObjectId();
      const requestUserId = new Types.ObjectId();

      mockRequest.params = { id: bookId };
      mockRequest.user = { _id: requestUserId };

      const mockBook = {
        _id: bookId,
        user: bookOwnerId,
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
    });
  });

  describe("deleteBook", () => {
    it("should delete a book successfully", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId();

      const mockBook = {
        _id: bookId,
        user: userId,
        bookFileName: "book.pdf",
        thumbnailFileName: "thumbnail.jpg",
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      mockRequest.params = { id: bookId };
      mockRequest.user = { _id: userId };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(deleteFile).toHaveBeenCalledTimes(2); // Should delete both book and thumbnail
      expect(mockBook.deleteOne).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book deleted successfully",
      });
    });

    it("should return 404 if book not found", async () => {
      // Arrange
      mockRequest.params = { id: new Types.ObjectId().toString() };
      (Book.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if user is not authorized", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      const bookOwnerId = new Types.ObjectId();
      const requestUserId = new Types.ObjectId();

      mockRequest.params = { id: bookId };
      mockRequest.user = { _id: requestUserId };

      const mockBook = {
        _id: bookId,
        user: bookOwnerId,
        bookFileName: "book.pdf",
        thumbnailFileName: "thumbnail.jpg",
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe("getBookThumbnail", () => {
    it("should send the thumbnail file", async () => {
      // Arrange
      mockRequest.params = { thumbnailName: "test.jpg" };

      // Act
      await bookController.getBookThumbnail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.sendFile).toHaveBeenCalled();
      expect(path.join).toHaveBeenCalledWith(
        expect.anything(),
        uploadedThumbnailsPath,
        "test.jpg"
      );
    });
  });

  describe("getBookFile", () => {
    it("should send the book file", async () => {
      // Arrange
      mockRequest.params = { bookName: "test.pdf" };

      // Act
      await bookController.getBookFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.sendFile).toHaveBeenCalled();
      expect(path.join).toHaveBeenCalledWith(
        expect.anything(),
        uploadedBooksPath,
        "test.pdf"
      );
    });
  });

  describe("getBookGenres", () => {
    it("should return all genres", async () => {
      // Arrange
      const mockGenres = [{ name: "Fiction" }, { name: "Science" }];
      (Genre.find as jest.Mock).mockResolvedValue(mockGenres);

      // Act
      await bookController.getBookGenres(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGenres);
    });

    it("should handle errors", async () => {
      // Arrange
      (Genre.find as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      // Act
      await bookController.getBookGenres(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
