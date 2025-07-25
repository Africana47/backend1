const Investment = require('../models/Investment');
const Portfolio = require('../models/Portfolio');
const Joi = require('joi');

// Joi schema for investment product creation (admin side)
const productSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  sector: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
  minAmount: Joi.number().positive().required(),
  roi: Joi.number().positive().required(),
  risk: Joi.string().valid('Low', 'Medium', 'High').required(),
  durationMonths: Joi.number().positive().optional(),
  currency: Joi.string().optional(),
  isAvailable: Joi.boolean().optional(),
  featured: Joi.boolean().optional()
});

// Create a new investment product (admin-only)
exports.createInvestment = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const investment = new Investment(req.body);
    await investment.save();
    res.status(201).json(investment);
  } catch (err) {
    console.error('Error creating investment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available investment products (public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Investment.find({ isAvailable: true });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
exports.getProductDetails = async (req, res) => {
  try {
    const product = await Investment.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fractional investment (user)
exports.fractionalInvest = async (req, res) => {
  try {
    const { amount, productId } = req.body;
    if (!amount || !productId)
      return res.status(400).json({ message: 'Amount and product ID are required.' });

    const product = await Investment.findById(productId);
    if (!product || !product.isAvailable)
      return res.status(404).json({ message: 'Invalid or unavailable product.' });

    if (amount < product.minAmount)
      return res.status(400).json({ message: `Minimum amount is ${product.minAmount}` });

    const shares = amount / product.minAmount;

    // Create a holding
    const holding = {
      product: product._id,
      initialInvestment: amount,
      currentValue: amount,
      shares,
      performance: 0,
    };

    // Find or create the user's portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });

    if (!portfolio) {
      portfolio = new Portfolio({
        user: req.user.id,
        holdings: [holding],
        riskProfile: 'moderate', // Or fetch from user's profile
      });
    } else {
      portfolio.holdings.push(holding);
    }

    await portfolio.save();

    res.status(201).json({ message: 'Investment successful', data: portfolio });
  } catch (err) {
    console.error('Error investing:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get user's full portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user.id }).populate('productId');
    const totalValue = portfolio.reduce((sum, entry) => sum + entry.amount, 0);

    res.status(200).json({
      user: req.user.id,
      totalValue,
      investments: portfolio,
    });
  } catch (err) {
    console.error('Error getting portfolio:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dummy liquidation logic
exports.liquidate = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({ message: `Investment ${id} liquidated.` });
  } catch (err) {
    console.error('Liquidation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dummy performance data
exports.getPerformance = async (req, res) => {
  try {
    const performance = {
      totalReturn: '8.5%',
      investments: [
        { name: 'Tech Growth Fund', return: '12%' },
        { name: 'AgriBond', return: '5%' }
      ]
    };
    res.json(performance);
  } catch (err) {
    console.error('Performance fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
