// controllers/portfolioController.js
const Portfolio = require('../models/portfolio');
const Product = require('../models/product');

// @desc    Add an investment to the user's portfolio
// @route   POST /api/portfolio/add
// @access  Private
exports.addInvestment = async (req, res) => {
  try {
    const { productId, amount } = req.body;
    const userId = req.user.id;

    if (!productId || !amount) {
      return res.status(400).json({ message: 'Product ID and amount are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentValue = amount;
    const shares = amount / product.price;

    let portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      portfolio = new Portfolio({
        user: userId,
        riskProfile: 'moderate',
        holdings: [],
      });
    }

    portfolio.holdings.push({
      product: product._id,
      initialInvestment: amount,
      currentValue,
      shares,
      purchaseDate: new Date(),
      performance: 0,
    });

    await portfolio.save();
    res.status(200).json({
      message: '✅ Investment added to portfolio',
      portfolio,
    });
  } catch (err) {
    console.error('❌ Add investment error:', err);
    res.status(500).json({ message: 'Server error adding investment' });
  }
};

// @desc    Get logged-in user's full portfolio
// @route   GET /api/portfolio
// @access  Private
exports.getUserPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id }).populate('holdings.product');

    if (!portfolio) {
      return res.status(404).json({ message: 'No portfolio found for user' });
    }

    res.status(200).json(portfolio);
  } catch (err) {
    console.error('❌ Get portfolio error:', err);
    res.status(500).json({ message: 'Server error fetching portfolio' });
  }
};
