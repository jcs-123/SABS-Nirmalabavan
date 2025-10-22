// backend/models/Administration.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String }, // path like /uploads/admins/filename.jpg
  },
  { timestamps: true }
);

const Administration = mongoose.model("Administration", adminSchema);
export default Administration;
