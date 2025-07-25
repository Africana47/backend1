// controllers/recommendationController.js
const Product = require('../models/Product');
const User = require('../models/User');

exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const risk = user.riskTolerance || 'medium';

    const match = {
      low: ['bonds', 'real estate'],
      medium: ['etf', 'index fund'],
      high: ['stocks', 'crypto']
    };

    const suggestions = await Product.find({
      category: { $in: match[risk] }
    }).limit(5);

    res.json({ riskProfile: risk, suggestions });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
};
