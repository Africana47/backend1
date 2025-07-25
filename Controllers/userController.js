const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('investments');

    const portfolio = await Portfolio.findOne({ user: req.user.id });

    res.json({
      user,
      portfolio
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {
  const { name, riskTolerance } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, riskTolerance },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get risk assessment
// @route   POST /api/users/risk-assessment
// @access  Private
exports.assessRisk = async (req, res) => {
  const { answers } = req.body; // Array of question answers

  try {
    // Simplified risk assessment
    const score = answers.reduce((sum, answer) => sum + answer.value, 0);
    let riskTolerance;

    if (score < 20) riskTolerance = 'conservative';
    else if (score < 40) riskTolerance = 'moderate';
    else riskTolerance = 'aggressive';

    // Update user profile
    await User.findByIdAndUpdate(req.user.id, { riskTolerance });

    res.json({ riskTolerance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    const portfolio = await Portfolio.findOne({ user: userId });

    res.json({
      message: 'Dashboard loaded successfully',
      user: {
        id: user._id,
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        riskTolerance: user.riskTolerance,
      },
      portfolio: {
        totalPortfolio: portfolio?.totalValue || 0,
        investments: portfolio?.investments || [],
        insurance: portfolio?.insurance || [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard', error: err.message });
  }
};
