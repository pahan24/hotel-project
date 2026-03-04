const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true },
    value: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
