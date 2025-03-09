import { deleteFile } from "../../src/utils/FileHelper";
import fs from "fs";

// Mock fs module
jest.mock("fs");

describe("FileHelper", () => {
  describe("deleteFile", () => {
    // Spy on console methods
    beforeEach(() => {
      jest.spyOn(console, "log").mockImplementation(() => {});
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should delete a file successfully", async () => {
      // Mock successful deletion
      (fs.unlink as unknown as jest.Mock).mockImplementation(
        (path, callback) => {
          callback(null);
        }
      );

      const testPath = "/test/path/file.txt";
      await deleteFile(testPath);

      // Verify fs.unlink was called with correct path
      expect(fs.unlink).toHaveBeenCalledWith(testPath, expect.any(Function));
      expect(console.log).toHaveBeenCalledWith("File is deleted.");
      expect(console.error).not.toHaveBeenCalled();
    });

    it("should handle fs.unlink error", async () => {
      const testError = new Error("Unlink error");
      // Mock error during deletion
      (fs.unlink as unknown as jest.Mock).mockImplementation(
        (path, callback) => {
          callback(testError);
        }
      );

      const testPath = "/test/path/file.txt";
      await deleteFile(testPath);

      // Verify error handling
      expect(fs.unlink).toHaveBeenCalledWith(testPath, expect.any(Function));
      expect(console.error).toHaveBeenCalledWith(testError);
      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
