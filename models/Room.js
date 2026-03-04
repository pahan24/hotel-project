const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'Suite', 'Deluxe', 'Standard'
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    maxOccupancy: { type: Number, required: true, default: 2 },
    facilities: [{ type: String }],
    images: [{ type: String }], // Array of image URLs/paths
    isAvailable: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
