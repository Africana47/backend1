const axios = require('axios');
const Currency = require('../models/Currency');

// Supported currency codes
const SUPPORTED_CURRENCIES = [
  // African
  'KES', 'NGN', 'ZAR', 'EGP', 'XOF', 'GHS', 'TZS', 'MAD', 'DZD', 'UGX',

  // Global
  'USD', 'EUR', 'GBP', 'CNY', 'JPY', 'CAD', 'AUD', 'CHF', 'INR'
];

// Fetch exchange rates from a third-party API
exports.updateRates = async (req, res) => {
  try {
    const base = 'USD';
    const symbols = SUPPORTED_CURRENCIES.join(',');
    const apiKey = process.env.CURRENCY_API_KEY;

    const response = await axios.get(`https://api.exchangerate.host/latest`, {
      params: {
        base,
        symbols
      }
    });

    const rates = response.data.rates;

    // Save or update in DB
    for (const [code, rate] of Object.entries(rates)) {
      await Currency.findOneAndUpdate(
        { code },
        { code, rate, base },
        { upsert: true, new: true }
      );
    }

    res.json({
      message: 'Exchange rates updated successfully',
      base,
      updated: rates
    });
  } catch (err) {
    console.error('Currency update error:', err.message);
    res.status(500).json({ message: 'Failed to update currency rates' });
  }
};

// Get list of supported currencies
exports.getSupportedCurrencies = async (req, res) => {
  res.json({
    supported: SUPPORTED_CURRENCIES
  });
};

// Convert currency
exports.convert = async (req, res) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({ message: 'Missing query parameters' });
    }

    const fromCurrency = await Currency.findOne({ code: from.toUpperCase() });
    const toCurrency = await Currency.findOne({ code: to.toUpperCase() });

    if (!fromCurrency || !toCurrency) {
      return res.status(404).json({ message: 'Currency not supported' });
    }

    // Convert: amount in USD then to target
    const amountInBase = parseFloat(amount) / fromCurrency.rate;
    const converted = amountInBase * toCurrency.rate;

    res.json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: parseFloat(amount),
      converted: parseFloat(converted.toFixed(2)),
      rate: toCurrency.rate / fromCurrency.rate
    });
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ message: 'Currency conversion failed' });
  }
};
