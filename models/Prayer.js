import mongoose from "mongoose";

const prayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending | Prayed | Replied
}, { timestamps: true });

export default mongoose.model("Prayer", prayerSchema);
