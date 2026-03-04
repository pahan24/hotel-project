const mongoose = require('mongoose');

const tableReservationSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    date: Date,
    time: String,
    guests: Number,
    notes: String,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TableReservation', tableReservationSchema);
