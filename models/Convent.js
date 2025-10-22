import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: String,
  image: String,
});

const conventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    superior: { type: String },
    superiorImage: { type: String },
    about: { type: String },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    established: { type: String },
    sisters: { type: String },
    ministries: [{ type: String }],
    image: { type: String }, // Main convent image
    members: [memberSchema], // Array of member objects
  },
  { timestamps: true }
);

const Convent = mongoose.model("Convent", conventSchema);
export default Convent;
