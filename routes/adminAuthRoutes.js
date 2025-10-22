// backend/routes/adminAuthRoutes.js
import express from "express";
import { loginAdmin, verifyToken } from "../controllers/adminAuthController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

// Example protected route
router.get("/me", verifyToken, (req, res) => {
  // optionally return admin info
  res.json({ adminId: req.adminId });
});

export default router;
