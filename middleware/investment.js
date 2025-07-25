const Investment = require('../models/Investment');

// Check if user owns the investment
exports.checkInvestmentOwnership = async (req, res, next) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    // Check if user owns the investment or is admin
    if (
      investment.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this investment'
      });
    }

    req.investment = investment;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Validate investment status
exports.checkInvestmentStatus = (allowedStatuses) => {
  return (req, res, next) => {
    if (!allowedStatuses.includes(req.investment.status)) {
      return res.status(400).json({
        success: false,
        message: `Investment must be in status: ${allowedStatuses.join(', ')}`
      });
    }
    next();
  };
};