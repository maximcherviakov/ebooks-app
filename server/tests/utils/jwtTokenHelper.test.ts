import jwt from "jsonwebtoken";
import { createToken } from "../../src/utils/jwtTokenHelper";
import { jwtExpiresIn, jwtSecretKey } from "../../src/config/envconfig";
import { IUserTokenPayload } from "../../src/types/type";

// Mock jsonwebtoken
jest.mock("jsonwebtoken");

// Mock environment config
jest.mock("../../src/config/envconfig", () => ({
  jwtSecretKey: "test-secret-key",
  jwtExpiresIn: "1h",
}));

describe("jwtTokenHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createToken", () => {
    it("should return a string token", () => {
      // Mock implementation
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const payload: IUserTokenPayload = {
        userId: "123",
        username: "testuser",
        email: "test@example.com",
      };

      const token = createToken(payload);

      expect(typeof token).toBe("string");
      expect(token).toBe("mock-token");
    });

    it("should call jwt.sign with correct parameters", () => {
      // Mock implementation
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const payload: IUserTokenPayload = {
        userId: "123",
        username: "testuser",
        email: "test@example.com",
      };

      createToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, jwtSecretKey, {
        expiresIn: jwtExpiresIn,
        algorithm: "HS256",
      });
    });
  });
});
