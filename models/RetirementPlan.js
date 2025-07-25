// models/RetirementPlan.js

const mongoose = require('mongoose');

const retirementPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['401k', 'traditional_ira', 'roth_ira', 'employer_sponsored', 'individual', 'pension']
  },
  currentBalance: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  monthlyContribution: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  employerMatch: {
    type: Number,
    default: 0,
    min: 0
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  targetAge: {
    type: Number,
    required: true,
    min: 18,
    max: 120
  },
  riskTolerance: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    default: 'moderate'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Index for faster queries
retirementPlanSchema.index({ userId: 1, isActive: 1 });

// Virtual for calculating progress percentage
retirementPlanSchema.virtual('progressPercentage').get(function() {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.currentBalance / this.targetAmount) * 100, 100);
});

// Method to calculate years to retirement
retirementPlanSchema.methods.calculateYearsToRetirement = function(currentAge) {
  return Math.max(this.targetAge - currentAge, 0);
};

// Method to calculate projected balance
retirementPlanSchema.methods.calculateProjectedBalance = function(currentAge, assumedReturnRate = 0.07) {
  const yearsToRetirement = this.calculateYearsToRetirement(currentAge);
  const monthlyRate = assumedReturnRate / 12;
  const totalMonths = yearsToRetirement * 12;
  
  // Future value of current balance
  const futureValueCurrent = this.currentBalance * Math.pow(1 + assumedReturnRate, yearsToRetirement);
  
  // Future value of monthly contributions (annuity)
  const monthlyTotal = this.monthlyContribution + this.employerMatch;
  let futureValueContributions = 0;
  
  if (monthlyRate > 0) {
    futureValueContributions = monthlyTotal * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
  } else {
    futureValueContributions = monthlyTotal * totalMonths;
  }
  
  return futureValueCurrent + futureValueContributions;
};

module.exports = mongoose.model('RetirementPlan', retirementPlanSchema);