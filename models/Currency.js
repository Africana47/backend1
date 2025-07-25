const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
  },
  rate: {
    type: Number,
    required: true
  },
  base: {
    type: String,
    default: 'USD'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Currency', currencySchema);
