import express from "express";
import multer from "multer";
import {
  createProvince,
  getProvinces,
  updateProvince,
  deleteProvince,
} from "../controllers/provinceController.js";

const router = express.Router();

// configure multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/provinces"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CRUD routes
router.post("/", upload.single("image"), createProvince);
router.get("/", getProvinces);
router.put("/:id", upload.single("image"), updateProvince);
router.delete("/:id", deleteProvince);

export default router;
