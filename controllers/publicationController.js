import Publication from "../models/Publication.js";
import fs from "fs";

// 🟢 Create new publication
export const createPublication = async (req, res) => {
  try {
    const { title, type, link } = req.body;

    const thumbnailFile = req.files?.thumbnail
      ? `/uploads/publications/${req.files.thumbnail[0].filename}`
      : null;

    const pdfFile = req.files?.pdf
      ? `/uploads/publications/${req.files.pdf[0].filename}`
      : null;

    const pub = new Publication({
      title,
      type,
      link,
      thumbnail: thumbnailFile,
      pdf: pdfFile,
    });

    await pub.save();
    res.status(201).json({ success: true, data: pub });
  } catch (error) {
    console.error("❌ Error creating publication:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get all publications
export const getPublications = async (req, res) => {
  try {
    const pubs = await Publication.find().sort({ createdAt: -1 });
    res.json(pubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get single publication
export const getPublicationById = async (req, res) => {
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) return res.status(404).json({ message: "Publication not found" });
    res.json(pub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 Update publication
export const updatePublication = async (req, res) => {
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) return res.status(404).json({ message: "Publication not found" });

    pub.title = req.body.title || pub.title;
    pub.type = req.body.type || pub.type;
    pub.link = req.body.link || pub.link;

    // Handle thumbnail replacement
    if (req.files?.thumbnail) {
      if (pub.thumbnail && fs.existsSync(`.${pub.thumbnail}`)) {
        fs.unlinkSync(`.${pub.thumbnail}`);
      }
      pub.thumbnail = `/uploads/publications/${req.files.thumbnail[0].filename}`;
    }

    // Handle PDF replacement
    if (req.files?.pdf) {
      if (pub.pdf && fs.existsSync(`.${pub.pdf}`)) {
        fs.unlinkSync(`.${pub.pdf}`);
      }
      pub.pdf = `/uploads/publications/${req.files.pdf[0].filename}`;
    }

    await pub.save();
    res.json({ success: true, data: pub });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 Delete publication
export const deletePublication = async (req, res) => {
  try {
    const pub = await Publication.findById(req.params.id);
    if (!pub) return res.status(404).json({ message: "Publication not found" });

    // Delete files if exist
    if (pub.thumbnail && fs.existsSync(`.${pub.thumbnail}`)) {
      fs.unlinkSync(`.${pub.thumbnail}`);
    }
    if (pub.pdf && fs.existsSync(`.${pub.pdf}`)) {
      fs.unlinkSync(`.${pub.pdf}`);
    }

    await pub.deleteOne();
    res.json({ message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
