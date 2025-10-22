import NewsEvent from "../models/NewsEvent.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all news events
export const getAllNewsEvents = async (req, res) => {
  try {
    const { category, limit, page } = req.query;
    const query = { isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const newsEvents = await NewsEvent.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await NewsEvent.countDocuments(query);

    res.json({
      success: true,
      data: newsEvents,
      pagination: {
        current: pageNumber,
        pages: Math.ceil(total / pageSize),
        total: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching news events",
      error: error.message,
    });
  }
};

// Get single news event by ID
export const getNewsEventById = async (req, res) => {
  try {
    const newsEvent = await NewsEvent.findById(req.params.id);
    
    if (!newsEvent || !newsEvent.isActive) {
      return res.status(404).json({
        success: false,
        message: "News event not found",
      });
    }

    res.json({
      success: true,
      data: newsEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching news event",
      error: error.message,
    });
  }
};

// Create new news event
export const createNewsEvent = async (req, res) => {
  try {
    const { title, content, fullContent, date, category } = req.body;
    
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newsEvent = new NewsEvent({
      title,
      content,
      fullContent,
      date,
      category,
      image: req.body.image || "default-image.jpg",
      imagePath,
    });

    await newsEvent.save();

    res.status(201).json({
      success: true,
      message: "News event created successfully",
      data: newsEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating news event",
      error: error.message,
    });
  }
};

// Update news event
export const updateNewsEvent = async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (req.file) {
      updates.imagePath = `/uploads/${req.file.filename}`;
      
      // Delete old file if exists
      const existingNews = await NewsEvent.findById(req.params.id);
      if (existingNews && existingNews.imagePath) {
        const oldFilePath = path.join(__dirname, "..", existingNews.imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    updates.updatedAt = Date.now();

    const newsEvent = await NewsEvent.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!newsEvent) {
      return res.status(404).json({
        success: false,
        message: "News event not found",
      });
    }

    res.json({
      success: true,
      message: "News event updated successfully",
      data: newsEvent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating news event",
      error: error.message,
    });
  }
};

// Delete news event (soft delete)
export const deleteNewsEvent = async (req, res) => {
  try {
    const newsEvent = await NewsEvent.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!newsEvent) {
      return res.status(404).json({
        success: false,
        message: "News event not found",
      });
    }

    res.json({
      success: true,
      message: "News event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting news event",
      error: error.message,
    });
  }
};

// Get news events for homepage (limited)
export const getHomepageNews = async (req, res) => {
  try {
    const newsEvents = await NewsEvent.find({ isActive: true })
      .sort({ date: -1, createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: newsEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching homepage news",
      error: error.message,
    });
  }
};