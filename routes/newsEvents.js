import express from "express";
import {
  getAllNewsEvents,
  getNewsEventById,
  createNewsEvent,
  updateNewsEvent,
  deleteNewsEvent,
  getHomepageNews,
} from "../controllers/newsEventController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllNewsEvents);
router.get("/homepage", getHomepageNews);
router.get("/:id", getNewsEventById);

// Protected routes (add authentication middleware as needed)
router.post("/", upload.single("image"), createNewsEvent);
router.put("/:id", upload.single("image"), updateNewsEvent);
router.delete("/:id", deleteNewsEvent);

export default router;