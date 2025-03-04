import path from "path";
import { fromPath } from "pdf2pic";
import generateThumbnail from "../../src/utils/generateThumbnail";

// Mock dependencies
jest.mock("pdf2pic", () => ({
  fromPath: jest.fn(),
}));

jest.mock("../../src/config/envconfig", () => ({
  uploadedBooksPath: "mocked-books-path",
  uploadedThumbnailsPath: "mocked-thumbnails-path",
}));

describe("generateThumbnail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a thumbnail successfully", async () => {
    // Setup mock implementation
    const mockConvert = jest.fn().mockResolvedValue({
      name: "generated-thumbnail.png",
    });
    (fromPath as jest.Mock).mockReturnValue(mockConvert);

    // Call the function
    const pdfFilename = "test.pdf";
    const thumbnailFilename = "test-thumbnail";
    const result = await generateThumbnail(pdfFilename, thumbnailFilename);

    // Assertions
    expect(fromPath).toHaveBeenCalledWith(
      path.join(process.cwd(), "mocked-books-path", "test.pdf"),
      {
        density: 100,
        savePath: path.join(process.cwd(), "mocked-thumbnails-path"),
        format: "png",
        width: 900,
        height: 1200,
        saveFilename: "test-thumbnail",
      }
    );
    expect(mockConvert).toHaveBeenCalledWith(1, { responseType: "image" });
    expect(result).toBe("generated-thumbnail.png");
  });

  it("should throw an error if thumbnail generation fails", async () => {
    // Setup mock implementation to throw an error
    const mockError = new Error("PDF conversion failed");
    const mockConvert = jest.fn().mockRejectedValue(mockError);
    (fromPath as jest.Mock).mockReturnValue(mockConvert);

    // Call the function and expect it to throw
    const pdfFilename = "test.pdf";
    const thumbnailFilename = "test-thumbnail";

    await expect(
      generateThumbnail(pdfFilename, thumbnailFilename)
    ).rejects.toThrow(
      "Failed to generate thumbnail from PDF. Error: PDF conversion failed"
    );
  });
});
