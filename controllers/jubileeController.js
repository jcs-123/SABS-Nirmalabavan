import Jubilee from "../models/Jubilee.js";
import fs from "fs";

// 🟢 Upload multiple photos
export const uploadJubileePhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const imagePaths = req.files.map((file) => `/uploads/jubilee/${file.filename}`);
    const gallery = new Jubilee({ images: imagePaths });
    await gallery.save();

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    console.error("❌ Error uploading images:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Get all uploaded photos
export const getJubileePhotos = async (req, res) => {
  try {
    const galleries = await Jubilee.find().sort({ createdAt: -1 });
    // Flatten all image arrays
    const allImages = galleries.flatMap((g) => g.images);
    res.json(allImages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 Delete single image
export const deleteJubileeImage = async (req, res) => {
  try {
    const { imagePath } = req.body; // frontend sends full path

    // Remove image from all documents
    const galleries = await Jubilee.find({ images: imagePath });
    for (const g of galleries) {
      g.images = g.images.filter((img) => img !== imagePath);
      await g.save();
    }

    if (fs.existsSync(`.${imagePath}`)) fs.unlinkSync(`.${imagePath}`);
    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
