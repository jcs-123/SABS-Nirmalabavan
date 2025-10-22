import express from "express";
import multer from "multer";
import {
  createSlider,
  getSliders,
  deleteSlider,
} from "../controllers/sliderController.js";

const router = express.Router();

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createSlider);
router.get("/", getSliders);
router.delete("/:id", deleteSlider);

export default router;
