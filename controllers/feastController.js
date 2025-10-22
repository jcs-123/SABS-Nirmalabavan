// backend/controllers/feastController.js
import Feast from "../models/Feast.js";
import fs from "fs";

// ➕ Add new feast
export const createFeast = async (req, res) => {
  try {
    const { name, saint, date, color } = req.body;
    const imageFile = req.file;

    const image = imageFile ? `/uploads/feasts/${imageFile.filename}` : null;

    const newFeast = new Feast({ name, saint, date, color, image });
    await newFeast.save();

    res.status(201).json({ success: true, data: newFeast });
  } catch (err) {
    console.error("❌ Error creating feast:", err.message);
    res.status(500).json({ success: false, message: "Failed to create feast" });
  }
};

// 📋 Get all feasts
export const getFeasts = async (req, res) => {
  try {
    const feasts = await Feast.find().sort({ date: 1 });
    res.json(feasts);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📅 Get feast by ID
export const getFeastById = async (req, res) => {
  try {
    const feast = await Feast.findById(req.params.id);
    if (!feast) return res.status(404).json({ message: "Feast not found" });
    res.json(feast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update feast
export const updateFeast = async (req, res) => {
  try {
    const { name, saint, date, color } = req.body;
    const imageFile = req.file;

    const feast = await Feast.findById(req.params.id);
    if (!feast) return res.status(404).json({ message: "Feast not found" });

    if (imageFile) {
      if (feast.image && fs.existsSync(`.${feast.image}`)) {
        fs.unlinkSync(`.${feast.image}`);
      }
      feast.image = `/uploads/feasts/${imageFile.filename}`;
    }

    feast.name = name || feast.name;
    feast.saint = saint || feast.saint;
    feast.date = date || feast.date;
    feast.color = color || feast.color;

    await feast.save();
    res.json({ success: true, data: feast });
  } catch (err) {
    console.error("❌ Error updating feast:", err.message);
    res.status(500).json({ message: "Failed to update feast" });
  }
};

// ❌ Delete feast
export const deleteFeast = async (req, res) => {
  try {
    const feast = await Feast.findById(req.params.id);
    if (!feast) return res.status(404).json({ message: "Feast not found" });

    if (feast.image && fs.existsSync(`.${feast.image}`)) {
      fs.unlinkSync(`.${feast.image}`);
    }

    await Feast.findByIdAndDelete(req.params.id);
    res.json({ message: "Feast deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
