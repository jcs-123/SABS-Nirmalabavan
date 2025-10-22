import Convent from "../models/Convent.js";
import fs from "fs";

// 🟢 CREATE a new Convent
export const createConvent = async (req, res) => {
  try {
    const {
      name,
      address,
      superior,
      about,
      description,
      phone,
      email,
      established,
      sisters,
      ministries,
      members,
    } = req.body;

    const mainImage = req.files["image"]
      ? `/uploads/convents/${req.files["image"][0].filename}`
      : null;
    const superiorImage = req.files["superiorImage"]
      ? `/uploads/convents/${req.files["superiorImage"][0].filename}`
      : null;

    const memberList = req.files["members"]
      ? req.files["members"].map((file, idx) => ({
          name: members ? JSON.parse(members)[idx]?.name || "" : "",
          image: `/uploads/convents/${file.filename}`,
        }))
      : [];

    const convent = new Convent({
      name,
      address,
      superior,
      superiorImage,
      about,
      description,
      phone,
      email,
      established,
      sisters,
      ministries: ministries ? JSON.parse(ministries) : [],
      image: mainImage,
      members: memberList,
    });

    await convent.save();
    res.status(201).json({ success: true, data: convent });
  } catch (error) {
    console.error("❌ Error creating convent:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 READ all convents
export const getConvents = async (req, res) => {
  try {
    const convents = await Convent.find().sort({ createdAt: -1 });
    res.json(convents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 READ single convent by ID
export const getConventById = async (req, res) => {
  try {
    const convent = await Convent.findById(req.params.id);
    if (!convent) return res.status(404).json({ message: "Convent not found" });
    res.json(convent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 UPDATE
export const updateConvent = async (req, res) => {
  try {
    const convent = await Convent.findById(req.params.id);
    if (!convent) return res.status(404).json({ message: "Convent not found" });

    if (req.files["image"])
      convent.image = `/uploads/convents/${req.files["image"][0].filename}`;
    if (req.files["superiorImage"])
      convent.superiorImage = `/uploads/convents/${req.files["superiorImage"][0].filename}`;
    if (req.files["members"])
      convent.members = req.files["members"].map((f) => ({
        name: "Sister",
        image: `/uploads/convents/${f.filename}`,
      }));

    Object.assign(convent, req.body);
    if (req.body.ministries)
      convent.ministries = JSON.parse(req.body.ministries);

    await convent.save();
    res.json({ success: true, data: convent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE
export const deleteConvent = async (req, res) => {
  try {
    const convent = await Convent.findById(req.params.id);
    if (!convent) return res.status(404).json({ message: "Convent not found" });

    // delete images from filesystem
    [convent.image, convent.superiorImage, ...(convent.members || []).map(m => m.image)]
      .forEach((img) => {
        if (img && fs.existsSync(`.${img}`)) fs.unlinkSync(`.${img}`);
      });

    await convent.deleteOne();
    res.json({ message: "Convent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
