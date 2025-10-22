import express from "express";
import multer from "multer";
import fs from "fs";
import {
  createPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from "../controllers/publicationController.js";

const router = express.Router();

const uploadPath = "./uploads/publications";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

// 🟢 Routes
router.post("/", upload.fields([{ name: "thumbnail" }, { name: "pdf" }]), createPublication);
router.get("/", getPublications);
router.get("/:id", getPublicationById);
router.put("/:id", upload.fields([{ name: "thumbnail" }, { name: "pdf" }]), updatePublication);
router.delete("/:id", deletePublication);

export default router;
