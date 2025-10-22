import Slider from "../models/Slider.js";
import path from "path";
import fs from "fs";

// ➕ Create new slider
export const createSlider = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newSlider = new Slider({
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      image: `/uploads/${req.file.filename}`,
    });

    await newSlider.save();
    res.status(201).json(newSlider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📋 Get all sliders
export const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete slider
export const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ error: "Slider not found" });

    // Delete the image file
    const imgPath = path.join("uploads", path.basename(slider.image));
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
