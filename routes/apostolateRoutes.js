import express from "express";
import {
  getAllApostolates,
  getApostolateById,
  createApostolate,
  updateApostolate,
  deleteApostolate,
  addInstitution,
  getHomepageApostolates
} from "../controllers/apostolateController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllApostolates);
router.get("/homepage", getHomepageApostolates);
router.get("/:id", getApostolateById);

// Protected routes
router.post("/", upload.single("image"), createApostolate);
router.put("/:id", upload.single("image"), updateApostolate);
router.delete("/:id", deleteApostolate);
router.post("/:id/institutions", upload.single("image"), addInstitution);

export default router;