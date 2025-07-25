const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:     { type: Number, required: true },
  date:       { type: Date,   default: Date.now }
});

const investmentSchema = new mongoose.Schema({
  title:       String,
  description: String,
  amount:      Number,
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  proposedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  votesYes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  votesNo:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt:   { type: Date, default: Date.now }
});

const poolSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  contributions:[contributionSchema],
  investments: [investmentSchema],
  balance:     { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Pool', poolSchema);
