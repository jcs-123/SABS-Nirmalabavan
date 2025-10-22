// backend/controllers/adminController.js
import Administration from "../models/Administration.js";
import fs from "fs";

// ➕ Create new member
export const createAdmin = async (req, res) => {
  try {
    const { name, designation } = req.body;
    const imageFile = req.file;

    const image = imageFile ? `/uploads/admins/${imageFile.filename}` : null;

    const newAdmin = new Administration({ name, designation, image });
    await newAdmin.save();

    res.status(201).json({ success: true, data: newAdmin });
  } catch (err) {
    console.error("❌ Error creating member:", err.message);
    res.status(500).json({ success: false, message: "Failed to create member" });
  }
};

// 📋 Get all members
export const getAdmins = async (req, res) => {
  try {
    const admins = await Administration.find().sort({ createdAt: -1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update member
export const updateAdmin = async (req, res) => {
  try {
    const { name, designation } = req.body;
    const imageFile = req.file;

    const member = await Administration.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (imageFile) {
      if (member.image && fs.existsSync(`.${member.image}`)) {
        fs.unlinkSync(`.${member.image}`);
      }
      member.image = `/uploads/admins/${imageFile.filename}`;
    }

    member.name = name || member.name;
    member.designation = designation || member.designation;

    await member.save();
    res.json({ success: true, data: member });
  } catch (err) {
    console.error("❌ Error updating member:", err.message);
    res.status(500).json({ message: "Failed to update member" });
  }
};

// ❌ Delete member
export const deleteAdmin = async (req, res) => {
  try {
    const member = await Administration.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (member.image && fs.existsSync(`.${member.image}`)) {
      fs.unlinkSync(`.${member.image}`);
    }

    await Administration.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
