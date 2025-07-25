const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  investment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Investment', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  policyNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  coverageType: { 
    type: String, 
    enum: ['default-protection', 'buyback-guarantee', 'value-protection'], 
    required: true 
  },
  coverageAmount: { 
    type: Number, 
    required: true 
  },
  premium: { 
    type: Number, 
    required: true 
  },
  premiumFrequency: { 
    type: String, 
    enum: ['monthly', 'quarterly', 'annual', 'single'], 
    required: true 
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: Date,
  terms: String,
  claims: [{
    date: Date,
    amount: Number,
    status: { type: String, enum: ['pending', 'approved', 'denied', 'paid'] },
    reason: String
  }],
  deductible: Number,
  riskPoolContribution: Number,
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

// Pre-save hook to generate policy number
insuranceSchema.pre('save', function(next) {
  if (!this.policyNumber) {
    this.policyNumber = `POL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Insurance', insuranceSchema);