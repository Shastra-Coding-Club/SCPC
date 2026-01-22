import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://frontend.com"] /* Change this to actual site */
        : "*",
  })
);


/* Cloudinary Setup */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Multer */
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/images
 * body: form-data -> image
 */
app.post("/images", upload.single("image"), async (req, res) => {
  try {
    // Validation
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Core logic
    const stream = cloudinary.uploader.upload_stream(
      { folder: "core-images" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.status(201).json({
          id: result.public_id,
          url: result.secure_url,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/images
 * Fetch all core images
 */
app.get("/images", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:core-images")
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();

    const images = result.resources.map((img) => ({
      id: img.public_id,
      url: img.secure_url,
    }));

    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Server */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
