// backend/routes/feastRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createFeast,
  getFeasts,
  getFeastById,
  updateFeast,
  deleteFeast,
} from "../controllers/feastController.js";

const router = express.Router();

// Ensure feast upload directory exists
const feastUploadPath = "./uploads/feasts";
if (!fs.existsSync(feastUploadPath)) {
  fs.mkdirSync(feastUploadPath, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, feastUploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createFeast);
router.get("/", getFeasts);
router.get("/:id", getFeastById);
router.put("/:id", upload.single("image"), updateFeast);
router.delete("/:id", deleteFeast);

export default router;
