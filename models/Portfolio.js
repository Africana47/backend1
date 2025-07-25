const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  investedOn: {
    type: Date,
    default: Date.now
  },
  expectedReturn: {
    type: Number,
    required: true
  },
  durationMonths: {
    type: Number,
    default: 12
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'liquidated'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
