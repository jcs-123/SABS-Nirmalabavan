import Province from "../models/Province.js";
import fs from "fs";

// ➕ Create Province
export const createProvince = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      history, 
      established, 
      communities, 
      focus, 
      impact 
    } = req.body;

    // if multer uploaded an image
    const imagePath = req.file ? `/uploads/provinces/${req.file.filename}` : null;

    const newProvince = new Province({
      name,
      description,
      history,
      established,
      communities,
      focus,
      impact,
      image: imagePath,
    });

    await newProvince.save();
    res.status(201).json(newProvince);
  } catch (err) {
    console.error("Error creating province:", err.message);
    res.status(500).json({ error: "Failed to create province" });
  }
};

// 📋 Get All Provinces
export const getProvinces = async (req, res) => {
  try {
    const provinces = await Province.find().sort({ createdAt: -1 });
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Province
export const updateProvince = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      history, 
      established, 
      communities, 
      focus, 
      impact 
    } = req.body;
    
    const updateData = { 
      name, 
      description, 
      history, 
      established, 
      communities, 
      focus, 
      impact 
    };

    if (req.file) {
      updateData.image = `/uploads/provinces/${req.file.filename}`;
    }

    const updated = await Province.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: "Province not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete Province
export const deleteProvince = async (req, res) => {
  try {
    const province = await Province.findById(req.params.id);
    if (!province) return res.status(404).json({ error: "Province not found" });

    // remove image file if exists
    if (province.image && fs.existsSync(`.${province.image}`)) {
      fs.unlinkSync(`.${province.image}`);
    }

    await Province.findByIdAndDelete(req.params.id);
    res.json({ message: "Province deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};