import express from "express";
import multer from "multer";
import { createAlbum, getAlbums, getAlbumById, deleteAlbum } from "../controllers/galleryController.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/gallery"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.fields([{ name: "cover", maxCount: 1 }, { name: "photos", maxCount: 20 }]), createAlbum);
router.get("/", getAlbums);
router.get("/:id", getAlbumById);
router.delete("/:id", deleteAlbum);

export default router;
