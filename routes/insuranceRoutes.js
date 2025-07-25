const express = require('express');
const router = express.Router();
const insuranceController = require('../Controllers/insuranceController');
const {authMiddleware} = require('../middleware/auth');

console.log('getOptions is:', typeof insuranceController.getOptions); // should log: function
console.log('purchase is:', typeof insuranceController.purchase);
console.log('executeBuyback is:', typeof insuranceController.executeBuyback);

// Insurance options for investment
router.get('/options/:investmentId', authMiddleware, insuranceController.getOptions);

// Purchase insurance
router.post('/purchase', authMiddleware, insuranceController.purchase);

// Claim insurance
router.post('/claims', authMiddleware, insuranceController.fileClaim);

// Buyback execution
router.post('/buyback', authMiddleware, insuranceController.executeBuyback);

// Get user's insurance policies
router.get('/policies', authMiddleware, insuranceController.getPolicies);

module.exports = router;