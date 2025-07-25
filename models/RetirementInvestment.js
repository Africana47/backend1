const mongoose = require('mongoose');

const RetirementInvestmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [100, 'Minimum investment is 100']
  },
  retirementDate: {
    type: Date,
    required: true
  },
  planType: {
    type: String,
    enum: ['pension', 'annuity', 'savings', 'other'],
    default: 'pension'
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// You can also add virtuals, methods, or pre-hooks here if needed

module.exports = mongoose.model('RetirementInvestment', RetirementInvestmentSchema);
