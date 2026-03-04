const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: Number,
    size: String,
    image: String,
    gallery: [String],
    description: String,
    facilities: [String],
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
