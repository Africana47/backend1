// controllers/fundController.js
const Fund = require('../models/Fund');

exports.getAllFunds = async (req, res) => {
  try {
    const funds = await Fund.find();
    res.json(funds);
  } catch (err) {
    console.error('Fund fetch error:', err);
    res.status(500).json({ message: 'Error fetching funds' });
  }
};

exports.getFundById = async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id);
    if (!fund) return res.status(404).json({ message: 'Fund not found' });
    res.json(fund);
  } catch (err) {
    console.error('Fund error:', err);
    res.status(500).json({ message: 'Error fetching fund' });
  }
};
