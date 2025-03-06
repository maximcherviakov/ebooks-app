import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../src/models/user.model";

jest.setTimeout(1200000); // 30 seconds timeout

describe("User Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("User Schema Validation", () => {
    it("should create a valid user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const user = await User.create(userData);

      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Password should be hashed
    });

    it("should throw validation error for missing required fields", async () => {
      await expect(User.create({})).rejects.toThrow();
    });

    it("should throw validation error for invalid email format", async () => {
      const userData = {
        username: "testuser",
        email: "invalid-email",
        password: "password123",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should throw validation error for short username", async () => {
      const userData = {
        username: "ab", // Less than 3 characters
        email: "test@example.com",
        password: "password123",
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it("should throw validation error for short password", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "short", // Less than 8 characters
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe("Password Hashing (pre-save hook)", () => {
    it("should hash password before saving", async () => {
      const plainPassword = "password123";
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: plainPassword,
      });

      // Password should be hashed
      expect(user.password).not.toBe(plainPassword);

      // Verify the hashed password can be compared correctly
      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    it("should not rehash password if not modified", async () => {
      // Create initial user
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const originalHash = user.password;

      // Update user without changing password
      user.username = "updateduser";
      await user.save();

      // Password hash should remain unchanged
      expect(user.password).toBe(originalHash);
    });

    it("should rehash password when modified", async () => {
      // Create initial user
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const originalHash = user.password;

      // Update user's password
      user.password = "newpassword123";
      await user.save();

      // Password hash should be different
      expect(user.password).not.toBe(originalHash);

      // New password should work with comparePassword
      const isMatch = await user.comparePassword("newpassword123");
      expect(isMatch).toBe(true);
    });

    it("should handle errors in password hashing", async () => {
      // Mock bcrypt.genSalt to throw an error
      const mockGenSalt = jest.spyOn(bcrypt, "genSalt");
      mockGenSalt.mockImplementationOnce(() => {
        throw new Error("Mock bcrypt error");
      });

      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      await expect(User.create(userData)).rejects.toThrow("Mock bcrypt error");

      // Restore the original implementation
      mockGenSalt.mockRestore();
    });
  });

  describe("comparePassword method", () => {
    it("should return true for matching password", async () => {
      const plainPassword = "password123";
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: plainPassword,
      });

      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const user = await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const isMatch = await user.comparePassword("wrongpassword");
      expect(isMatch).toBe(false);
    });
  });
});
