const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionController');
const {authMiddleware} = require('../middleware/auth');

// Deposit funds
router.post('/deposit', authMiddleware, transactionController.deposit);

// Withdraw funds
router.post('/withdraw', authMiddleware, transactionController.withdraw);

// Transaction history
router.get('/history', authMiddleware, transactionController.getHistory);
router.get('/:id', authMiddleware, transactionController.getTransaction);

module.exports = router;