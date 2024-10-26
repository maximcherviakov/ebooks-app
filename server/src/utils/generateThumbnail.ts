import path from "path";
import { fromPath } from "pdf2pic";
import { uploadedBooksPath, uploadedThumbnailsPath } from "../config/envconfig";

const options = {
  density: 100,
  savePath: path.join(process.cwd(), uploadedThumbnailsPath),
  format: "png",
  width: 900,
  height: 1200,
};

const pageToConvertAsImage = 1;

// Helper function to generate thumbnail
const generateThumbnail = async (
  pdfFilename: string,
  thumbnailFilename: string
): Promise<string> => {
  try {
    const pdfPath = path.join(process.cwd(), uploadedBooksPath, pdfFilename);

    const convert = fromPath(pdfPath, {
      ...options,
      saveFilename: thumbnailFilename,
    });
    const result = await convert(pageToConvertAsImage, {
      responseType: "image",
    });

    return result.name;
  } catch (error) {
    throw new Error(`Failed to generate thumbnail from PDF. ${error}`);
  }
};

export default generateThumbnail;
