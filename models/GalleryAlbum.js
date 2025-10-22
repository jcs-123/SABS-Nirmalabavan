import mongoose from "mongoose";

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String },
    cover: { type: String },
    photos: [String],
  },
  { timestamps: true }
);

export default mongoose.model("GalleryAlbum", galleryAlbumSchema);
