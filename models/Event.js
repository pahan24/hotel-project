const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true, default: 'The Grove Kandy' },
    image: { type: String },
    isPast: { type: Boolean, default: false },
    allowRegistration: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
