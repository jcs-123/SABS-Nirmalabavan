import mongoose from "mongoose";

const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["youtube", "book", "media"], required: true },
    link: { type: String },
    thumbnail: { type: String }, // optional (uploaded image)
    pdf: { type: String },       // optional (uploaded PDF)
  },
  { timestamps: true }
);

export default mongoose.model("Publication", publicationSchema);
