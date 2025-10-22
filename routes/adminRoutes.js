// backend/routes/adminRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Ensure upload folder exists
const adminUploadPath = "./uploads/admins";
if (!fs.existsSync(adminUploadPath)) {
  fs.mkdirSync(adminUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, adminUploadPath),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createAdmin);
router.get("/", getAdmins);
router.put("/:id", upload.single("image"), updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
