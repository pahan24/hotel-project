const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountDetails: { type: String, required: true },
    validUntil: { type: Date, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
