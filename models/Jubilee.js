import mongoose from "mongoose";

const jubileeSchema = new mongoose.Schema(
  {
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model("Jubilee", jubileeSchema);
