import fs from "fs";

export const deleteFile = async (filePath: string) => {
  try {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("File is deleted.");
      }
    });
  } catch (error) {
    console.error(error);
  }
};
