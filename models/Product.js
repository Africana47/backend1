// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
//   },
//   description: { 
//     type: String, 
//     required: true 
//   },
//   category: { 
//     type: String, 
//     enum: ['venture', 'real-estate', 'retirement', 'loan', 'equity', 'fixed-income'],
//     required: true 
//   },
//   riskRating: { 
//     type: Number, 
//     min: 1, 
//     max: 10, 
//     required: true 
//   },
//   targetReturn: { 
//     type: Number, 
//     required: true 
//   },
//   minInvestment: { 
//     type: Number, 
//     default: 0 
//   },
//   isInsuranceAvailable: { 
//     type: Boolean, 
//     default: false 
//   },
//   insuranceTerms: String,
//   buybackGuarantee: { 
//     type: Boolean, 
//     default: false 
//   },
//   buybackTerms: String,
//   liquidityOptions: { 
//     type: String, 
//     enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually', 'term-end'], 
//     default: 'term-end' 
//   },
//   termLength: Number, // in months
//   issuer: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Issuer' 
//   },
//   documents: [{
//     name: String,
//     url: String,
//     type: String
//   }],
//   status: { 
//     type: String, 
//     enum: ['active', 'paused', 'closed', 'liquidated'], 
//     default: 'active' 
//   },
//   tags: [String],
//   performanceHistory: [{
//     date: Date,
//     value: Number,
//     return: Number
//   }],
//   totalRaised: { 
//     type: Number, 
//     default: 0 
//   },
//   fundingTarget: Number,
//   riskPoolAllocation: { 
//     type: Number, 
//     default: 0.05 // 5% of investment goes to risk pool
//   }
// }, { timestamps: true });

// // Text index for search
// productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., fintech, agriculture
  description: { type: String },
  roi: { type: Number, required: true }, // Expected return
  minAmount: { type: Number, required: true },
  image: { type: String },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  duration: { type: Number }, // in months or years
  region: { type: String },
  type: { type: String, enum: ['equity', 'loan', 'bond'], default: 'equity' }
}, { timestamps: true });

/* ✅ Prevent OverwriteModelError */
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
