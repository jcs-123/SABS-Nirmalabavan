import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "default-institution.jpg"
  },
  imagePath: {
    type: String
  },
  established: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  }
});

const apostolateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "default-apostolate.jpg"
  },
  imagePath: {
    type: String
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  institutionsCount: {
    type: Number,
    default: 0
  },
  institutions: [institutionSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

apostolateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.institutionsCount = this.institutions.length;
  next();
});

export default mongoose.model("Apostolate", apostolateSchema);