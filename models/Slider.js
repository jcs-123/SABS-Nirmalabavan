// backend/models/Slider.js
import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String, required: true }, // e.g. /uploads/filename.jpg
    link: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Slider", sliderSchema);
