const Insurance = require('../models/Insurance');
const Investment = require('../models/Investment');

// @desc    Get insurance options for investment
// @route   GET /api/insurance/:investmentId
// @access  Private
exports.getInsuranceOptions = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.investmentId,
      user: req.user.id
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Simplified insurance options
    const options = [
      {
        type: 'basic',
        coverage: '80% of principal',
        premium: investment.amount * 0.02, // 2%
        terms: 'Covers loss of principal up to 80%'
      },
      {
        type: 'premium',
        coverage: '100% buyback guarantee',
        premium: investment.amount * 0.05, // 5%
        terms: 'Guaranteed buyback at original price after 3 years'
      }
    ];

    res.json(options);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Purchase insurance
// @route   POST /api/insurance
// @access  Private
exports.purchaseInsurance = async (req, res) => {
  const { investmentId, insuranceType } = req.body;

  try {
    const investment = await Investment.findOne({
      _id: investmentId,
      user: req.user.id
    });

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Create insurance policy
    const insurance = new Insurance({
      user: req.user.id,
      investment: investmentId,
      type: insuranceType,
      status: 'active',
      coverageAmount: insuranceType === 'basic' 
        ? investment.amount * 0.8 
        : investment.amount,
      premium: insuranceType === 'basic' 
        ? investment.amount * 0.02 
        : investment.amount * 0.05
    });

    await insurance.save();

    // Update investment with insurance
    investment.insurance = insurance._id;
    await investment.save();

    res.status(201).json(insurance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getOptions = (req, res) => {
  res.json({ message: 'Insurance options will go here.' });
};

exports.purchase = async (req, res) => {
  try {
    // Your logic to handle purchasing insurance
    res.status(200).json({ message: 'Insurance purchased successfully' });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ message: 'Failed to purchase insurance' });
  }
};

exports.executeBuyback = async (req, res) => {
  try {
    // Example logic
    res.status(200).json({ message: 'Buyback executed successfully' });
  } catch (err) {
    console.error('Buyback error:', err);
    res.status(500).json({ message: 'Buyback failed' });
  }
};

exports.fileClaim = async (req, res) => {
  res.status(200).json({ message: 'Claim submitted successfully (placeholder)' });
};

exports.getPolicies = async (req, res) => {
  res.status(200).json({ message: 'Insurance policies fetched successfully (placeholder)' });
};

