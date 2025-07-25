// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const portfolioCtrl = require('../Controllers/portfolioController');

// router.post('/add', auth, portfolioCtrl.addInvestment);
// router.get('/me', auth, portfolioCtrl.getUserPortfolio);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { addInvestment, getUserPortfolio } = require('../Controllers/portfolioController');
const {authMiddleware} = require('../middleware/authMiddleware'); // assuming you use it

// POST /api/portfolio/add
router.post('/add', authMiddleware, addInvestment);

// GET /api/portfolio
router.get('/', authMiddleware, getUserPortfolio);

module.exports = router;
