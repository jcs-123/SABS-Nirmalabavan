import express from "express";
import multer from "multer";
import fs from "fs";
import {
  createConvent,
  getConvents,
  getConventById,
  updateConvent,
  deleteConvent,
} from "../controllers/conventController.js";

const router = express.Router();
const uploadPath = "./uploads/convents";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "superiorImage", maxCount: 1 },
    { name: "members", maxCount: 10 },
  ]),
  createConvent
);

router.get("/", getConvents);
router.get("/:id", getConventById);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "superiorImage", maxCount: 1 },
    { name: "members", maxCount: 10 },
  ]),
  updateConvent
);
router.delete("/:id", deleteConvent);

export default router;
