import mongoose from "mongoose";

const newsEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  fullContent: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Meeting', 'Gathering', 'Awards', 'Service', 'Inauguration', 'Other']
  },
  image: {
    type: String,
    required: true
  },
  imagePath: {
    type: String
  },
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

newsEventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("NewsEvent", newsEventSchema);