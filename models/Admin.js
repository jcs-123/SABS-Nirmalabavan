// backend/models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
