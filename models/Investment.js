// BACKEND/models/Investment.js
const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
  {
    name:            { type: String,  required: true },
    category:        { type: String,  required: true },      // Energy, Fintech, etc.
    sector:          { type: String },                        // Optional finer tag
    description:     { type: String },
    image:           { type: String },

    // financials
    minAmount:       { type: Number, required: true },
    roi:             { type: Number, required: true },        // 15 == 15 %
    risk:            { type: String,
                       enum: ['Low', 'Medium', 'High'],
                       required: true },
    durationMonths:  { type: Number, default: 12 },
    currency:        { type: String, default: 'USD' },

    // state flags
    isAvailable:     { type: Boolean, default: true },        // close offer when false
    featured:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema); // ✅ CommonJS export
