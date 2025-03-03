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

    it("should search in title field", async () => {
      // Arrange
      const searchTerm = "Fantasy";
      mockRequest.query = { search: searchTerm };
      const mockBooks = [{ title: "Fantasy Adventure" }];

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
      expect(Book.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.arrayContaining([
            { title: { $regex: searchTerm, $options: "i" } },
          ]),
        })
      );
    });

    it("should search in all searchable fields (title, description, author)", async () => {
      // Arrange
      const searchTerm = "Fantasy";
      mockRequest.query = { search: searchTerm };
      const mockBooks = [{ title: "Book", description: "Fantasy adventure" }];

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
      expect(Book.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { author: { $regex: searchTerm, $options: "i" } },
          ],
        })
      );
    });

    it("should filter by genre", async () => {
      // Arrange
      const genreId = new Types.ObjectId();
      mockRequest.query = { genre: genreId.toString() };
      const mockBooks = [{ title: "Genre Specific Book" }];

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
      expect(Book.find).toHaveBeenCalledWith({ genres: genreId });
    });

    it("should filter by author", async () => {
      // Arrange
      const authorName = "J.K. Rowling";
      mockRequest.query = { author: authorName };
      const mockBooks = [{ title: "Harry Potter" }];

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
      expect(Book.find).toHaveBeenCalledWith({
        author: { $regex: authorName, $options: "i" },
      });
    });

    it("should filter by publication year", async () => {
      // Arrange
      const year = "2021";
      mockRequest.query = { year };
      const mockBooks = [{ title: "Book from 2021" }];

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
      expect(Book.find).toHaveBeenCalledWith({ year });
    });

    it("should use custom pagination parameters", async () => {
      // Arrange
      const page = 3;
      const limit = 10;
      mockRequest.query = { page: page.toString(), limit: limit.toString() };
      const mockBooks = [{ title: "Paginated Book" }];
      const totalBooks = 25; // This will result in 3 total pages with limit=10

      const sortMock = jest.fn().mockReturnThis();
      const skipMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockReturnThis();
      const populateMock = jest.fn().mockResolvedValue(mockBooks);

      (Book.find as jest.Mock).mockReturnValue({
        sort: sortMock,
        skip: skipMock,
        limit: limitMock,
        populate: populateMock,
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(totalBooks);

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(skipMock).toHaveBeenCalledWith((page - 1) * limit); // Skip 20 items
      expect(limitMock).toHaveBeenCalledWith(limit); // Limit to 10 items
      expect(mockResponse.json).toHaveBeenCalledWith({
        books: mockBooks,
        metadata: {
          currentPage: page,
          totalPages: 3, // 25 books / 10 per page = 3 pages
          totalBooks: totalBooks,
        },
      });
    });

    it("should handle last page with fewer items than limit", async () => {
      // Arrange
      const page = 3;
      const limit = 10;
      mockRequest.query = { page: page.toString(), limit: limit.toString() };

      // Only 3 books on the last page (total 23 books)
      const mockBooks = [
        { title: "Last Page Book 1" },
        { title: "Last Page Book 2" },
        { title: "Last Page Book 3" },
      ];
      const totalBooks = 23; // 10 + 10 + 3 = 23 books total

      (Book.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(totalBooks);

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
          currentPage: page,
          totalPages: 3, // 23 books with 10 per page = 3 pages
          totalBooks: totalBooks,
        },
      });
    });

    it("should sort books by specified field in ascending order", async () => {
      // Arrange
      mockRequest.query = { sortBy: "year", sortOrder: "asc" };
      const mockBooks = [{ year: 2000 }, { year: 2010 }];

      const sortMock = jest.fn().mockReturnThis();

      (Book.find as jest.Mock).mockReturnValue({
        sort: sortMock,
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(2);

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(sortMock).toHaveBeenCalledWith({ year: 1 }); // 1 represents ascending order
    });

    it("should sort books by specified field in descending order", async () => {
      // Arrange
      mockRequest.query = { sortBy: "title", sortOrder: "desc" };
      const mockBooks = [{ title: "Z Book" }, { title: "A Book" }];

      const sortMock = jest.fn().mockReturnThis();

      (Book.find as jest.Mock).mockReturnValue({
        sort: sortMock,
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(2);

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(sortMock).toHaveBeenCalledWith({ title: -1 }); // -1 represents descending order
    });

    it("should combine multiple filters", async () => {
      // Arrange
      const genreId = new Types.ObjectId();
      const authorName = "George Orwell";
      const year = "1949";

      mockRequest.query = {
        genre: genreId.toString(),
        author: authorName,
        year,
      };

      const mockBooks = [{ title: "1984" }];

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
      expect(Book.find).toHaveBeenCalledWith(
        expect.objectContaining({
          genres: genreId,
          author: { $regex: authorName, $options: "i" },
          year,
        })
      );
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

    it("should handle invalid sort parameters gracefully", async () => {
      // Arrange
      mockRequest.query = { sortBy: "invalidField", sortOrder: "invalid" };
      const mockBooks = [{ title: "Book" }];

      const sortMock = jest.fn().mockReturnThis();

      (Book.find as jest.Mock).mockReturnValue({
        sort: sortMock,
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
      // Should still work with invalid params, using the specified field with default descending order (-1)
      expect(sortMock).toHaveBeenCalledWith({ invalidField: -1 });
    });

    it("should handle empty result set properly", async () => {
      // Arrange
      mockRequest.query = { search: "NonExistentBook" };
      const mockBooks: any[] = []; // Empty result

      (Book.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockBooks),
      });

      (Book.find().countDocuments as jest.Mock) = jest
        .fn()
        .mockResolvedValue(0);

      // Act
      await bookController.getBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        books: [],
        metadata: {
          currentPage: DEFAULT_PAGE,
          totalPages: 0,
          totalBooks: 0,
        },
      });
    });
  });
});
