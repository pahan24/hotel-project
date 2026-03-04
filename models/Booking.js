const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    guests: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
    specialRequests: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
