const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    roomType: { type: String, required: true },
    nights: Number,
    totalAmount: Number,
    specialRequests: String,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked-In', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    receiptPath: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
