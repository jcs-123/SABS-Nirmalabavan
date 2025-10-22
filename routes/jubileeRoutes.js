import express from "express";
import multer from "multer";
import fs from "fs";
import {
  uploadJubileePhotos,
  getJubileePhotos,
  deleteJubileeImage,
} from "../controllers/jubileeController.js";

const router = express.Router();

const uploadDir = "./uploads/jubilee";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.array("images", 20), uploadJubileePhotos);
router.get("/", getJubileePhotos);
router.post("/delete", deleteJubileeImage);

export default router;
