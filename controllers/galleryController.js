import GalleryAlbum from "../models/GalleryAlbum.js";
import fs from "fs";

// ➕ Create new gallery album
export const createAlbum = async (req, res) => {
  try {
    const { title, year } = req.body;

    // Ensure upload folder exists
    const uploadPath = "./uploads/gallery";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const coverFile = req.files?.cover?.[0];
    const photosFiles = req.files?.photos || [];

    const cover = coverFile ? `/uploads/gallery/${coverFile.filename.replace(/\\/g, "/")}` : null;
    const photos = photosFiles.map((f) => `/uploads/gallery/${f.filename.replace(/\\/g, "/")}`);

    const newAlbum = new GalleryAlbum({ title, year, cover, photos });
    await newAlbum.save();
    res.status(201).json(newAlbum);
  } catch (err) {
    console.error("❌ Error creating album:", err.message);
    res.status(500).json({ error: "Failed to create album" });
  }
};

// 📋 Get all albums
export const getAlbums = async (req, res) => {
  try {
    const albums = await GalleryAlbum.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📸 Get one album by ID
export const getAlbumById = async (req, res) => {
  try {
    console.log("📸 Fetching album ID:", req.params.id);
    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    console.error("❌ Error fetching album:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Delete album
export const deleteAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });

    // Delete images
    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(`.${filePath}`)) fs.unlinkSync(`.${filePath}`);
    };
    deleteFile(album.cover);
    album.photos.forEach(deleteFile);

    await GalleryAlbum.findByIdAndDelete(req.params.id);
    res.json({ message: "Album deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
