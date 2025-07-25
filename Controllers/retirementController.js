const RetirementInvestment = require('../models/RetirementInvestment');
const Joi = require('joi');

// Validation schema (updated to allow empty notes)
const retirementSchema = Joi.object({
  amount: Joi.number().positive().min(100).required(),
  retirementDate: Joi.date().required(),
  planType: Joi.string().valid('pension', 'annuity', 'savings', 'other').default('pension'),
  riskLevel: Joi.string().valid('low', 'medium', 'high').default('medium'),
  notes: Joi.string().max(500).allow(''), // Added .allow('') to permit empty notes
});

// Helper function for projections
function calculateProjections({ initialAmount, years, annualReturn, monthlyContribution }) {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  let balance = initialAmount;
  const yearlyProjections = [];

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    yearlyProjections.push({
      year,
      balance: Math.round(balance),
      contributions: initialAmount + (monthlyContribution * 12 * year),
    });
  }

  return {
    finalAmount: Math.round(balance),
    yearlyBreakdown: yearlyProjections,
    totalContributions: initialAmount + (monthlyContribution * months),
    estimatedGrowth: Math.round(balance - (initialAmount + (monthlyContribution * months))),
  };
}

// Create a retirement plan
const createPlan = async (req, res) => {
  try {
    const { error, value } = retirementSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const currentYear = new Date().getFullYear();
    const retirementYear = new Date(value.retirementDate).getFullYear();
    const years = retirementYear - currentYear;

    const projections = calculateProjections({
      initialAmount: value.amount,
      years,
      annualReturn: 7,
      monthlyContribution: 0,
    });

    const investment = new RetirementInvestment({
      user: req.user.id,
      amount: value.amount,
      retirementDate: value.retirementDate,
      planType: value.planType,
      riskLevel: value.riskLevel,
      notes: value.notes,
    });

    await investment.save();

    res.status(201).json({
      message: '✅ Retirement plan created successfully',
      data: investment,
      projections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all retirement plans for a user
const getMyPlans = async (req, res) => {
  try {
    const plans = await RetirementInvestment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: plans,
      message: 'Retirement plans retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching retirement plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching retirement plans',
      error: error.message,
    });
  }
};

// Get projection for a single plan by ID
const getProjections = async (req, res) => {
  try {
    const plan = await RetirementInvestment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const currentYear = new Date().getFullYear();
    const years = new Date(plan.retirementDate).getFullYear() - currentYear;
    const updatedProjections = calculateProjections({
      initialAmount: plan.amount,
      years,
      annualReturn: 7,
      monthlyContribution: 0,
    });

    res.json({
      data: plan,
      projections: updatedProjections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Simulate contribution
const contribute = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid contribution amount.' });
    }

    res.status(200).json({ message: `Contributed ${amount} to retirement account.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while contributing.' });
  }
};

// Simulate withdrawal
const withdraw = async (req, res) => {
  res.json({ message: 'Withdraw processed successfully.' });
};

// Simulate tax advice
const getTaxAdvice = async (req, res) => {
  res.json({ message: 'Tax advice retrieved successfully.' });
};

module.exports = {
  createPlan,
  getMyPlans,
  getProjections,
  contribute,
  withdraw,
  getTaxAdvice,
};