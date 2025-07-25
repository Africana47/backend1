const express = require('express');
const router = express.Router();
const currencyController = require('../Controllers/currencyController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// 🔒 Admin-only: update all currency rates from external API
router.put('/update', authMiddleware, adminMiddleware, currencyController.updateRates);

// 🌍 Public: get supported currencies
router.get('/supported', currencyController.getSupportedCurrencies);

// 🔁 Public: convert from one currency to another
// Example: /api/currency/convert?from=USD&to=KES&amount=100
router.get('/convert', currencyController.convert);

module.exports = router;
