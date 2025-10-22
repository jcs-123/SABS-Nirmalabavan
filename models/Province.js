import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  history: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  // New optional fields
  established: {
    type: String,
    required: false
  },
  communities: {
    type: String,
    required: false
  },
  focus: {
    type: String,
    required: false
  },
  impact: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model("Province", provinceSchema);