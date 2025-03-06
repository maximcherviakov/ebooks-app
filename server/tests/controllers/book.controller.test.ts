import { Request, Response, Express } from "express";
import { Types } from "mongoose";
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
import { DEFAULT_PAGE } from "../../src/config/consts";

// Mock dependencies
jest.mock("../../src/models/book.model");
jest.mock("../../src/models/genre.model");
jest.mock("../../src/utils/generateThumbnail");
jest.mock("../../src/utils/FileHelper");
jest.mock("../../src/config/envconfig", () => ({
  uploadedBooksPath: "test-books-path",
  uploadedThumbnailsPath: "test-thumbnails-path",
}));
jest.mock("path", () => ({
  resolve: jest.fn().mockReturnValue("/mocked/path"),
  join: jest.fn().mockImplementation((...args) => args.join("/")),
  parse: jest
    .fn()
    .mockImplementation((filename) => ({ name: filename.split(".")[0] })),
}));

const createMockFile = (filename: string): Express.Multer.File => {
  return {
    fieldname: "book",
    originalname: `original_${filename}`,
    encoding: "7bit",
    mimetype: "application/pdf",
    size: 12345,
    destination: "/mock/destination",
    filename: filename,
    path: `/mock/destination/${filename}`,
    buffer: Buffer.from("mock file content"),
    stream: {} as any,
  };
};

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

    it("should sort books by createdAt in descending order", async () => {
      // Arrange
      const userId = new Types.ObjectId();
      mockRequest.user = { _id: userId };
      const sortMock = jest.fn().mockReturnThis();

      (Book.find as jest.Mock).mockReturnValue({
        sort: sortMock,
        populate: jest.fn().mockResolvedValue([]),
      });

      // Act
      await bookController.getUserBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it("should populate genres field with name property", async () => {
      // Arrange
      const userId = new Types.ObjectId();
      mockRequest.user = { _id: userId };
      const sortMock = jest.fn().mockReturnThis();
      const populateMock = jest.fn().mockResolvedValue([]);

      (Book.find as jest.Mock).mockReturnValue({
        sort: sortMock,
        populate: populateMock,
      });

      // Act
      await bookController.getUserBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(populateMock).toHaveBeenCalledWith("genres", "name");
    });

    it("should return empty array when user has no books", async () => {
      // Arrange
      mockRequest.user = { _id: new Types.ObjectId() };
      const emptyBooks: any[] = [];

      (Book.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(emptyBooks),
      });

      // Act
      await bookController.getUserBooks(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ books: [] });
    });
  });

  describe("getBook", () => {
    it("should return a book by ID", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      const mockBook = { title: "Test Book", author: "Test Author" };
      mockRequest.params = { id: bookId };

      const populateMock = jest.fn().mockReturnThis();
      const secondPopulateMock = jest.fn().mockResolvedValue(mockBook);

      (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(true);
      (Book.findById as jest.Mock).mockReturnValue({
        populate: populateMock.mockImplementation(function () {
          this.populate = secondPopulateMock;
          return this;
        }),
      });

      // Act
      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });

    it("should return 400 for invalid ID", async () => {
      // Arrange
      mockRequest.params = { id: "invalid-id" };
      (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(false);

      // Act
      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid book ID",
      });
    });

    it("should return 404 when book not found", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      mockRequest.params = { id: bookId };

      const populateMock = jest.fn().mockReturnThis();
      const secondPopulateMock = jest.fn().mockResolvedValue(null);

      (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(true);
      (Book.findById as jest.Mock).mockReturnValue({
        populate: populateMock.mockImplementation(function () {
          this.populate = secondPopulateMock;
          return this;
        }),
      });

      // Act
      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 when an error occurs", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      mockRequest.params = { id: bookId };

      (Types.ObjectId.isValid as jest.Mock) = jest.fn().mockReturnValue(true);
      (Book.findById as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      // Act
      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error fetching book",
          error: expect.any(Error),
        })
      );
    });
  });

  describe("getBookThumbnail", () => {
    it("should send the thumbnail file", async () => {
      // Arrange
      const thumbnailName = "test-thumbnail.jpg";
      mockRequest.params = { thumbnailName };

      // Act
      await bookController.getBookThumbnail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.sendFile).toHaveBeenCalledWith(
        path.join(process.cwd(), uploadedThumbnailsPath, thumbnailName)
      );
      expect(path.join).toHaveBeenCalledWith(
        process.cwd(),
        uploadedThumbnailsPath,
        thumbnailName
      );
    });

    it("should return 500 when an error occurs", async () => {
      // Arrange
      const thumbnailName = "test-thumbnail.jpg";
      mockRequest.params = { thumbnailName };

      const error = new Error("File not found");
      mockResponse.sendFile = jest.fn().mockImplementation(() => {
        throw error;
      });

      // Act
      await bookController.getBookThumbnail(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error fetching thumbnail",
        error,
      });
    });
  });

  describe("getBookFile", () => {
    it("should send the book file", async () => {
      // Arrange
      const bookName = "test-book.pdf";
      mockRequest.params = { bookName };

      // Act
      await bookController.getBookFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.sendFile).toHaveBeenCalledWith(
        path.join(process.cwd(), uploadedBooksPath, bookName)
      );
      expect(path.join).toHaveBeenCalledWith(
        process.cwd(),
        uploadedBooksPath,
        bookName
      );
    });

    it("should return 500 when an error occurs", async () => {
      // Arrange
      const bookName = "test-book.pdf";
      mockRequest.params = { bookName };

      const error = new Error("File not found");
      mockResponse.sendFile = jest.fn().mockImplementation(() => {
        throw error;
      });

      // Act
      await bookController.getBookFile(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error fetching book file",
        error,
      });
    });
  });

  describe("getBookGenres", () => {
    it("should return all genres with 200 status", async () => {
      // Arrange
      const mockGenres = [
        { _id: new Types.ObjectId(), name: "Fiction" },
        { _id: new Types.ObjectId(), name: "Non-fiction" },
      ];

      (Genre.find as jest.Mock).mockResolvedValue(mockGenres);

      // Act
      await bookController.getBookGenres(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockGenres);
      expect(Genre.find).toHaveBeenCalled();
    });

    it("should return empty array when no genres exist", async () => {
      // Arrange
      const emptyGenres: any[] = [];
      (Genre.find as jest.Mock).mockResolvedValue(emptyGenres);

      // Act
      await bookController.getBookGenres(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(emptyGenres);
    });

    it("should return 500 when an error occurs", async () => {
      // Arrange
      const error = new Error("Database error");
      (Genre.find as jest.Mock).mockRejectedValue(error);

      // Act
      await bookController.getBookGenres(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error fetching genres",
        error,
      });
    });
  });

  describe("createBook", () => {
    beforeEach(() => {
      (generateThumbnail as jest.Mock).mockResolvedValue("test-thumbnail.jpg");

      // Reset mocks between tests
      jest.clearAllMocks();
    });

    it("should create a new book successfully", async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const genreIds = [
        { _id: new Types.ObjectId() },
        { _id: new Types.ObjectId() },
      ];
      const mockFile = createMockFile("test-book.pdf");

      mockRequest = {
        body: {
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction", "Thriller"],
        },
        files: [mockFile],
        user: { _id: userId },
      };

      // Mock the chained method Genre.find().select()
      const mockSelectFn = jest.fn().mockResolvedValue(genreIds);
      const mockFindFn = jest.fn().mockReturnValue({ select: mockSelectFn });
      (Genre.find as jest.Mock).mockImplementation(mockFindFn);

      const mockSavedBook = {
        _id: new Types.ObjectId(),
        title: "Test Book",
        author: "Test Author",
      };

      (Book.prototype.save as jest.Mock) = jest
        .fn()
        .mockResolvedValue(mockSavedBook);

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(Genre.find).toHaveBeenCalledWith({
        name: { $in: ["Fiction", "Thriller"] },
      });
      expect(mockSelectFn).toHaveBeenCalledWith("_id");
      expect(Book.prototype.save).toHaveBeenCalled();
      expect(generateThumbnail).toHaveBeenCalledWith(
        "test-book.pdf",
        "test-book"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockSavedBook);
    });

    it("should return 400 if title is missing", async () => {
      // Arrange
      const mockFile = createMockFile("test-book.pdf");
      mockRequest = {
        body: {
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction"],
        },
        files: [mockFile],
        user: { _id: new Types.ObjectId() },
      };

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
      expect(Book.prototype.save).not.toHaveBeenCalled();
    });

    it("should return 400 when some genres are invalid", async () => {
      // Arrange
      const mockFile = createMockFile("test-book.pdf");
      mockRequest = {
        body: {
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction", "InvalidGenre"],
        },
        files: [mockFile],
        user: { _id: new Types.ObjectId() },
      };

      // Only one genre is found, not both - mocking the find().select() chain
      const mockSelectFn = jest
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId() }]);
      const mockFindFn = jest.fn().mockReturnValue({ select: mockSelectFn });
      (Genre.find as jest.Mock).mockImplementation(mockFindFn);

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Some genres are invalid",
      });
      expect(Book.prototype.save).not.toHaveBeenCalled();
    });

    it("should return 400 if no file is uploaded", async () => {
      // Arrange
      mockRequest = {
        body: {
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction"],
        },
        files: [], // Empty files array
        user: { _id: new Types.ObjectId() },
      };

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "File is required",
      });
      expect(Book.prototype.save).not.toHaveBeenCalled();
    });

    it("should handle error during genre validation", async () => {
      // Arrange
      const mockFile = createMockFile("test-book.pdf");
      mockRequest = {
        body: {
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction"],
        },
        files: [mockFile],
        user: { _id: new Types.ObjectId() },
      };

      // Mock an error in the find().select() chain
      const mockSelectFn = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));
      const mockFindFn = jest.fn().mockReturnValue({ select: mockSelectFn });
      (Genre.find as jest.Mock).mockImplementation(mockFindFn);

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error creating book",
          error: expect.any(Error),
        })
      );
    });

    it("should handle error when generating thumbnail", async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const mockFile = createMockFile("test-book.pdf");
      mockRequest = {
        body: {
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction"],
        },
        files: [mockFile],
        user: { _id: userId },
      };

      // Mock the chained method for Genre.find().select()
      const mockSelectFn = jest
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId() }]);
      const mockFindFn = jest.fn().mockReturnValue({ select: mockSelectFn });
      (Genre.find as jest.Mock).mockImplementation(mockFindFn);

      // Mock thumbnail generation failure
      (generateThumbnail as jest.Mock).mockRejectedValue(
        new Error("Thumbnail generation failed")
      );

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error creating book",
          error: expect.any(Error),
        })
      );
      expect(Book.prototype.save).not.toHaveBeenCalled();
    });

    it("should handle error when saving the book", async () => {
      // Arrange
      const userId = new Types.ObjectId();
      const mockFile = createMockFile("test-book.pdf");
      mockRequest = {
        body: {
          title: "Test Book",
          description: "Test Description",
          author: "Test Author",
          year: "2023",
          genres: ["Fiction"],
        },
        files: [mockFile],
        user: { _id: userId },
      };

      // Mock the chained method for Genre.find().select()
      const mockSelectFn = jest
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId() }]);
      const mockFindFn = jest.fn().mockReturnValue({ select: mockSelectFn });
      (Genre.find as jest.Mock).mockImplementation(mockFindFn);

      // Mock thumbnail generation success
      (generateThumbnail as jest.Mock).mockResolvedValue("test-thumbnail.jpg");

      // Mock book save failure
      (Book.prototype.save as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      // Act
      await bookController.createBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Error creating book",
          error: expect.any(Error),
        })
      );
    });
  });

  describe("updateBook", () => {
    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();

      // Set up default mock responses
      (generateThumbnail as jest.Mock).mockResolvedValue(
        "new-test-thumbnail.jpg"
      );
      (deleteFile as jest.Mock).mockImplementation(() => {});
    });

    it("should successfully update a book without file upload", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        description: "Original Description",
        author: "Original Author",
        year: "2022",
        genres: [new Types.ObjectId()],
        bookFileName: "original-book.pdf",
        thumbnailFileName: "original-thumbnail.jpg",
        user: userId,
        save: jest.fn().mockResolvedValue({
          _id: bookId,
          title: "Updated Title",
          description: "Updated Description",
          author: "Updated Author",
          year: "2023",
        }),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: {
          title: "Updated Title",
          description: "Updated Description",
          author: "Updated Author",
          year: "2023",
          genres: ["Fiction", "Drama"],
        },
        user: { _id: userId },
        files: [],
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Mock genre lookup
      const mockGenreIds = [
        { _id: new Types.ObjectId() },
        { _id: new Types.ObjectId() },
      ];
      const mockSelectFn = jest.fn().mockResolvedValue(mockGenreIds);
      const mockFindFn = jest.fn().mockReturnValue({ select: mockSelectFn });
      (Genre.find as jest.Mock).mockImplementation(mockFindFn);

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(Book.findById).toHaveBeenCalledWith(bookId.toString());
      expect(Genre.find).toHaveBeenCalledWith({
        name: { $in: ["Fiction", "Drama"] },
      });
      expect(mockSelectFn).toHaveBeenCalledWith("_id");
      expect(mockBook.save).toHaveBeenCalled();
      expect(mockBook.title).toBe("Updated Title");
      expect(mockBook.description).toBe("Updated Description");
      expect(mockBook.author).toBe("Updated Author");
      expect(mockBook.year).toBe("2023");
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
      // Ensure no file manipulation was done
      expect(generateThumbnail).not.toHaveBeenCalled();
      expect(deleteFile).not.toHaveBeenCalled();
    });

    it("should update a book with a new file upload", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const mockFile = createMockFile("new-book.pdf");

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        description: "Original Description",
        author: "Original Author",
        year: "2022",
        genres: [new Types.ObjectId()],
        bookFileName: "original-book.pdf",
        thumbnailFileName: "original-thumbnail.jpg",
        user: userId,
        save: jest.fn().mockResolvedValue({
          _id: bookId,
          title: "Updated Title",
          bookFileName: "new-book.pdf",
          thumbnailFileName: "new-test-thumbnail.jpg",
        }),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: {
          title: "Updated Title",
          genres: ["Fiction"],
        },
        user: { _id: userId },
        files: [mockFile],
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Mock genre lookup
      const mockGenreIds = [{ _id: new Types.ObjectId() }];
      const mockSelectFn = jest.fn().mockResolvedValue(mockGenreIds);
      (Genre.find as jest.Mock).mockReturnValue({ select: mockSelectFn });

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(generateThumbnail).toHaveBeenCalledWith(
        "new-book.pdf",
        "new-book"
      );
      expect(deleteFile).toHaveBeenCalledTimes(2);
      expect(deleteFile).toHaveBeenNthCalledWith(
        1,
        path.join(uploadedBooksPath, "original-book.pdf")
      );
      expect(deleteFile).toHaveBeenNthCalledWith(
        2,
        path.join(uploadedThumbnailsPath, "original-thumbnail.jpg")
      );
      expect(mockBook.bookFileName).toBe("new-book.pdf");
      expect(mockBook.thumbnailFileName).toBe("new-test-thumbnail.jpg");
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });

    it("should return 404 when book is not found", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      mockRequest = {
        params: { id: bookId.toString() },
        body: { title: "Updated Title" },
        user: { _id: new Types.ObjectId() },
      };

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

    it("should return 403 when user is not the owner", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const bookOwnerId = new Types.ObjectId();
      const requestUserId = new Types.ObjectId(); // Different user ID

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        user: bookOwnerId,
        save: jest.fn(),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: { title: "Updated Title" },
        user: { _id: requestUserId }, // Different user tries to update
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
      expect(mockBook.save).not.toHaveBeenCalled();
    });

    it("should return 400 when genres are invalid", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        user: userId,
        save: jest.fn(),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: {
          title: "Updated Title",
          genres: ["Fiction", "InvalidGenre"],
        },
        user: { _id: userId },
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Mock finding only one valid genre out of two requested
      const mockSelectFn = jest
        .fn()
        .mockResolvedValue([{ _id: new Types.ObjectId() }]);
      (Genre.find as jest.Mock).mockReturnValue({ select: mockSelectFn });

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Some genres are invalid",
      });
      expect(mockBook.save).not.toHaveBeenCalled();
    });

    it("should handle errors when finding book", async () => {
      // Arrange
      mockRequest = {
        params: { id: new Types.ObjectId().toString() },
        body: { title: "Updated Title" },
        user: { _id: new Types.ObjectId() },
      };

      const error = new Error("Database error");
      (Book.findById as jest.Mock).mockRejectedValue(error);

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error updating book",
        error,
      });
    });

    it("should handle errors when generating thumbnail", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const mockFile = createMockFile("new-book.pdf");

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        bookFileName: "original-book.pdf",
        thumbnailFileName: "original-thumbnail.jpg",
        user: userId,
        save: jest.fn(),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: { title: "Updated Title", genres: ["Fiction"] },
        user: { _id: userId },
        files: [mockFile],
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);
      (Genre.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: new Types.ObjectId() }]),
      });

      // Mock thumbnail generation error
      const error = new Error("Thumbnail generation failed");
      (generateThumbnail as jest.Mock).mockRejectedValue(error);

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error updating book",
        error,
      });
      expect(mockBook.save).not.toHaveBeenCalled();
    });

    it("should handle errors when validating genres", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        user: userId,
        save: jest.fn(),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: { title: "Updated Title", genres: ["Fiction"] },
        user: { _id: userId },
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Mock genre validation error
      const error = new Error("Genre validation failed");
      (Genre.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error updating book",
        error,
      });
      expect(mockBook.save).not.toHaveBeenCalled();
    });

    it("should handle errors when saving the book", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const error = new Error("Save failed");
      const mockBook = {
        _id: bookId,
        title: "Original Title",
        user: userId,
        save: jest.fn().mockRejectedValue(error),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: { title: "Updated Title", genres: ["Fiction"] },
        user: { _id: userId },
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
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error updating book",
        error,
      });
    });

    it("should handle partial updates with only one field", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const mockBook = {
        _id: bookId,
        title: "Original Title",
        description: "Original Description",
        author: "Original Author",
        year: "2022",
        genres: [new Types.ObjectId()],
        bookFileName: "original-book.pdf",
        thumbnailFileName: "original-thumbnail.jpg",
        user: userId,
        save: jest.fn().mockResolvedValue({
          _id: bookId,
          title: "Updated Title",
          description: "Original Description", // Should remain unchanged
          author: "Original Author", // Should remain unchanged
          year: "2022", // Should remain unchanged
        }),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        body: {
          title: "Updated Title",
          // No other fields provided
        },
        user: { _id: userId },
        files: [],
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Act
      await bookController.updateBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(Book.findById).toHaveBeenCalledWith(bookId.toString());
      expect(mockBook.save).toHaveBeenCalled();
      expect(mockBook.title).toBe("Updated Title");
      // Verify other fields remain unchanged
      expect(mockBook.description).toBe("Original Description");
      expect(mockBook.author).toBe("Original Author");
      expect(mockBook.year).toBe("2022");
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });
  });

  describe("deleteBook", () => {
    it("should successfully delete a book when user is owner", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const bookFileName = "test-book.pdf";
      const thumbnailFileName = "test-thumbnail.jpg";

      const mockBook = {
        _id: bookId,
        title: "Book to Delete",
        bookFileName,
        thumbnailFileName,
        user: userId,
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        user: { _id: userId },
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(Book.findById).toHaveBeenCalledWith(bookId.toString());
      expect(deleteFile).toHaveBeenCalledTimes(2);
      expect(deleteFile).toHaveBeenNthCalledWith(
        1,
        path.join(uploadedBooksPath, bookFileName)
      );
      expect(deleteFile).toHaveBeenNthCalledWith(
        2,
        path.join(uploadedThumbnailsPath, thumbnailFileName)
      );
      expect(mockBook.deleteOne).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book deleted successfully",
      });
    });

    it("should return 404 when book is not found", async () => {
      // Arrange
      const bookId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: bookId },
        user: { _id: new Types.ObjectId() },
      };

      (Book.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Book not found",
      });
      expect(deleteFile).not.toHaveBeenCalled();
    });

    it("should return 403 when user is not the owner", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const bookOwnerId = new Types.ObjectId();
      const requestUserId = new Types.ObjectId(); // Different user ID

      const mockBook = {
        _id: bookId,
        title: "Protected Book",
        bookFileName: "book.pdf",
        thumbnailFileName: "thumbnail.jpg",
        user: bookOwnerId,
        deleteOne: jest.fn(),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        user: { _id: requestUserId }, // Different user tries to delete
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
      expect(deleteFile).not.toHaveBeenCalled();
      expect(mockBook.deleteOne).not.toHaveBeenCalled();
    });

    it("should handle file deletion errors gracefully", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const mockBook = {
        _id: bookId,
        title: "Book with File Issue",
        bookFileName: "problematic-file.pdf",
        thumbnailFileName: "problematic-thumbnail.jpg",
        user: userId,
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        user: { _id: userId },
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);

      // Mock file deletion failure
      const error = new Error("File deletion failed");
      (deleteFile as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error deleting book",
        error: expect.any(Error),
      });
      expect(mockBook.deleteOne).not.toHaveBeenCalled();
    });

    it("should handle database deletion errors", async () => {
      // Arrange
      const bookId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      const error = new Error("Database deletion failed");
      const mockBook = {
        _id: bookId,
        title: "Book with DB Issue",
        bookFileName: "test-book.pdf",
        thumbnailFileName: "test-thumbnail.jpg",
        user: userId,
        deleteOne: jest.fn().mockRejectedValue(error),
      };

      mockRequest = {
        params: { id: bookId.toString() },
        user: { _id: userId },
      };

      (Book.findById as jest.Mock).mockResolvedValue(mockBook);
      (deleteFile as jest.Mock).mockImplementation(() => {});

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error deleting book",
        error,
      });
      expect(deleteFile).toHaveBeenCalledTimes(2); // Files were still deleted
    });

    it("should handle error when finding book", async () => {
      // Arrange
      mockRequest = {
        params: { id: new Types.ObjectId().toString() },
        user: { _id: new Types.ObjectId() },
      };

      const error = new Error("Database error");
      (Book.findById as jest.Mock).mockRejectedValue(error);

      // Act
      await bookController.deleteBook(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error deleting book",
        error,
      });
      expect(deleteFile).not.toHaveBeenCalled();
    });
  });
});
