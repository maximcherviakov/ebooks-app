import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../../src/models/user.model";
import { createToken } from "../../src/utils/jwtTokenHelper";
import * as userController from "../../src/controllers/user.controller";

jest.mock("../../src/models/user.model");
jest.mock("../../src/utils/jwtTokenHelper");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: "testuser",
        email: "test@example.com",
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const mockToken = "mock-jwt-token";
      (createToken as jest.Mock).mockReturnValue(mockToken);

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockUser.save).toHaveBeenCalled();
      expect(createToken).toHaveBeenCalledWith({
        userId: mockUser._id.toString(),
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 400 when username is missing", async () => {
      // Arrange
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 400 when email is missing", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "password123",
      };

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 400 when password is missing", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        email: "test@example.com",
      };

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 400 when email is already registered", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        email: "existing@example.com",
        password: "password123",
      };

      const existingUser = { email: "existing@example.com" };
      (User.findOne as jest.Mock).mockResolvedValue(existingUser);

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        email: "existing@example.com",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Email is already registered",
      });
    });

    it("should return 409 when duplicate key error occurs", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const duplicateError = { code: 11000 };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      const mockUser = {
        save: jest.fn().mockRejectedValue(duplicateError),
      };
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Username or email already exists",
      });
    });

    it("should return 500 when other errors occur", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const generalError = new Error("Some database error");

      (User.findOne as jest.Mock).mockResolvedValue(null);
      const mockUser = {
        save: jest.fn().mockRejectedValue(generalError),
      };
      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("login", () => {
    it("should successfully login and return token", async () => {
      // Arrange
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: "testuser",
        email: "test@example.com",
      };

      mockRequest.user = mockUser;

      const mockToken = "mock-login-jwt-token";
      (createToken as jest.Mock).mockReturnValue(mockToken);

      // Act
      await userController.login(mockRequest as any, mockResponse as Response);

      // Assert
      expect(createToken).toHaveBeenCalledWith({
        userId: mockUser._id.toString(),
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 401 when user is not authenticated", async () => {
      // Arrange
      mockRequest.user = null;

      // Act
      await userController.login(mockRequest as any, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Authentication failed",
      });
      expect(createToken).not.toHaveBeenCalled();
    });

    it("should return 401 when user is undefined", async () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      await userController.login(mockRequest as any, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Authentication failed",
      });
      expect(createToken).not.toHaveBeenCalled();
    });
  });
});
