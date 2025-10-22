// backend/models/Feast.js
import mongoose from "mongoose";

const feastSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    saint: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "White",
    },
    image: {
      type: String, // stores image path like /uploads/feasts/img123.jpg
      required: false,
    },
  },
  { timestamps: true }
);

const Feast = mongoose.model("Feast", feastSchema);
export default Feast;
