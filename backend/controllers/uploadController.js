import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import streamifier from "streamifier";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading file:", req.file.originalname);

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    console.log("Cloudinary upload success:", result.secure_url);
    res.status(201).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
