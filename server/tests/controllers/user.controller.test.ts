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

  describe("info", () => {
    it("should return the user object from the request", async () => {
      // Arrange
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: "testuser",
        email: "test@example.com",
        role: "user",
      };

      mockRequest.user = mockUser;

      // Act
      await userController.info(mockRequest as any, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return empty response if user is not defined", async () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      await userController.info(mockRequest as any, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(undefined);
    });

    it("should return null if user is null", async () => {
      // Arrange
      mockRequest.user = null;

      // Act
      await userController.info(mockRequest as any, mockResponse as Response);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });
  });

  describe("resetPassword", () => {
    it("should successfully reset password", async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: userId,
        password: "oldPassword123",
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      mockRequest.user = { _id: userId };
      mockRequest.body = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword456",
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.comparePassword).toHaveBeenCalledWith("oldPassword123");
      expect(mockUser.password).toBe("newPassword456"); // Check if password was updated
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Password updated successfully",
      });
    });

    it("should return 400 when currentPassword is missing", async () => {
      // Arrange
      mockRequest.user = { _id: new mongoose.Types.ObjectId() };
      mockRequest.body = { newPassword: "newPassword456" };

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Current and new password are required",
      });
    });

    it("should return 400 when newPassword is missing", async () => {
      // Arrange
      mockRequest.user = { _id: new mongoose.Types.ObjectId() };
      mockRequest.body = { currentPassword: "oldPassword123" };

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Current and new password are required",
      });
    });

    it("should return 400 when newPassword is too short", async () => {
      // Arrange
      mockRequest.user = { _id: new mongoose.Types.ObjectId() };
      mockRequest.body = {
        currentPassword: "oldPassword123",
        newPassword: "short", // Less than 6 characters
      };

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "New password must be at least 6 characters long",
      });
    });

    it("should return 404 when user is not found", async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      mockRequest.user = { _id: userId };
      mockRequest.body = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword456",
      };

      (User.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    it("should return 403 when user is authenticated via third-party provider", async () => {
      // Arrange
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        googleId: "google-123456",
        comparePassword: jest.fn(),
      };

      mockRequest.user = { _id: mockUser._id };
      mockRequest.body = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword456",
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message:
          "Password reset is not available for accounts using third-party authentication",
      });
    });

    it("should return 401 when current password is incorrect", async () => {
      // Arrange
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockRequest.user = { _id: mockUser._id };
      mockRequest.body = {
        currentPassword: "wrongPassword",
        newPassword: "newPassword456",
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockUser.comparePassword).toHaveBeenCalledWith("wrongPassword");
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Current password is incorrect",
      });
    });

    it("should return 500 when an unexpected error occurs", async () => {
      // Arrange
      mockRequest.user = { _id: new mongoose.Types.ObjectId() };
      mockRequest.body = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword456",
      };

      const error = new Error("Database error");
      (User.findById as jest.Mock).mockRejectedValue(error);

      // Act
      await userController.resetPassword(
        mockRequest as any,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
