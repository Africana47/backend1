// controllers/transactionController.js
const Transaction = require('../models/Transaction'); // Make sure this model exists

// Deposit funds
exports.deposit = async (req, res) => {
  try {
    const { amount, description } = req.body;

    const transaction = new Transaction({
      user: req.user.id,
      type: 'deposit',
      amount,
      description,
      
      date: new Date(),
    });

    await transaction.save();

    res.status(201).json({ message: 'Deposit successful', transaction });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Failed to process deposit' });
  }
};

// Withdraw funds
exports.withdraw = async (req, res) => {
  try {
    const { amount, description } = req.body;

    // Optional: Check if user has enough balance before allowing withdrawal

    const transaction = new Transaction({
      user: req.user.id,
      type: 'withdraw',
      amount,
      description,
      date: new Date(),
    });

    await transaction.save();

    res.status(201).json({ message: 'Withdrawal successful', transaction });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
};

// Get all transactions for the authenticated user
exports.getHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ error: 'Failed to retrieve transaction history' });
  }
};

// Get a single transaction by ID
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
};
