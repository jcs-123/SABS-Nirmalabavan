import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import feastRoutes from "./routes/feastRoutes.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import provinceRoutes from "./routes/provinceRoutes.js";
import newsRoutes from "./routes/newsEvents.js";
import apostolateRoutes from "./routes/apostolateRoutes.js";
import prayerRoutes from "./routes/prayerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import contactRoute from "./routes/contact.js";
import adminRoutes from "./routes/adminRoutes.js";
import conventRoutes from "./routes/conventRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import jubileeRoutes from "./routes/jubileeRoutes.js"; // ADD THIS IMPORT
import adminAuthRoutes from "./routes/adminAuthRoutes.js";


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Uploads directory created");
}

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Static route for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ✅ API Routes
app.use("/api/feasts", feastRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/provinces", provinceRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/apostolates", apostolateRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoute);
app.use("/api/admins", adminRoutes);
app.use("/api/convents", conventRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/jubilee", jubileeRoutes); // ADD THIS ROUTE
app.use("/api/admin", adminAuthRoutes);


// ✅ Default route
app.get("/", (req, res) =>
  res.send("🚀 SABS Admin API running on http://localhost:5000")
);

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
