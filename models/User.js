const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true,
    select: false 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date, required: true },
  riskTolerance: { 
    type: String, 
    enum: ['conservative', 'Moderate', 'aggressive'], 
    default: 'moderate' 
  },
  kycStatus: { 
    type: String, 
    enum: ['unverified', 'pending', 'verified', 'rejected'], 
    default: 'unverified' 
  },
  kycDocuments: [{
    documentType: String,
    documentUrl: String,
    verificationStatus: String
  }],
  taxIdentification: String,
  bankAccounts: [{
    institution: String,
    lastFour: String,
    verificationStatus: String
  }],
  investmentProfile: {
    annualIncome: Number,
    netWorth: Number,
    investmentExperience: String,
    investmentObjectives: [String]
  },
   investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }],
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true }, 
  lastLogin: Date,
  status: { type: String, enum: ['active', 'suspended', 'closed'], default: 'active' }
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
