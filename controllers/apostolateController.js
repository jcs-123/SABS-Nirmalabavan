import Apostolate from "../models/Apostolate.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all apostolates
export const getAllApostolates = async (req, res) => {
  try {
    const apostolates = await Apostolate.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: apostolates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching apostolates",
      error: error.message,
    });
  }
};

// Get apostolate by ID
export const getApostolateById = async (req, res) => {
  try {
    const apostolate = await Apostolate.findById(req.params.id);
    
    if (!apostolate || !apostolate.isActive) {
      return res.status(404).json({
        success: false,
        message: "Apostolate not found",
      });
    }

    res.json({
      success: true,
      data: apostolate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching apostolate",
      error: error.message,
    });
  }
};

// Create new apostolate
export const createApostolate = async (req, res) => {
  try {
    const { title, description, icon, color } = req.body;
    
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const apostolate = new Apostolate({
      title,
      description,
      icon,
      color,
      imagePath,
      institutions: []
    });

    await apostolate.save();

    res.status(201).json({
      success: true,
      message: "Apostolate created successfully",
      data: apostolate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating apostolate",
      error: error.message,
    });
  }
};

// Update apostolate
export const updateApostolate = async (req, res) => {
  try {
    const { title, description, icon, color } = req.body;
    
    const updates = {
      title,
      description,
      icon,
      color,
      updatedAt: Date.now()
    };
    
    if (req.file) {
      updates.imagePath = `/uploads/${req.file.filename}`;
      
      // Delete old file if exists
      const existingApostolate = await Apostolate.findById(req.params.id);
      if (existingApostolate && existingApostolate.imagePath) {
        const oldFilePath = path.join(__dirname, "..", existingApostolate.imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const apostolate = await Apostolate.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!apostolate) {
      return res.status(404).json({
        success: false,
        message: "Apostolate not found",
      });
    }

    res.json({
      success: true,
      message: "Apostolate updated successfully",
      data: apostolate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating apostolate",
      error: error.message,
    });
  }
};

// Delete apostolate (soft delete)
export const deleteApostolate = async (req, res) => {
  try {
    const apostolate = await Apostolate.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!apostolate) {
      return res.status(404).json({
        success: false,
        message: "Apostolate not found",
      });
    }

    res.json({
      success: true,
      message: "Apostolate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting apostolate",
      error: error.message,
    });
  }
};

// Add institution to apostolate
export const addInstitution = async (req, res) => {
  try {
    const { name, location, website, type, established, description } = req.body;
    
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const institution = {
      name,
      location,
      website,
      type,
      established,
      description: description || "",
      imagePath
    };

    const apostolate = await Apostolate.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { institutions: institution },
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!apostolate) {
      return res.status(404).json({
        success: false,
        message: "Apostolate not found",
      });
    }

    // Update institutions count
    apostolate.institutionsCount = apostolate.institutions.length;
    await apostolate.save();

    res.json({
      success: true,
      message: "Institution added successfully",
      data: apostolate,
    });
  } catch (error) {
    console.error('Error in addInstitution:', error);
    res.status(400).json({
      success: false,
      message: "Error adding institution",
      error: error.message,
    });
  }
};

// Get homepage apostolates (limited)
export const getHomepageApostolates = async (req, res) => {
  try {
    const apostolates = await Apostolate.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: apostolates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching homepage apostolates",
      error: error.message,
    });
  }
};