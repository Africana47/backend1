// const express = require('express');
// const router = express.Router();
// const investmentController = require('../Controllers/investmentController');
// const authMiddleware = require('../middleware/auth');
// const { validateInvestment } = require('../validators/investment');


// // router.post(
// //   '/invest',
// //   authMiddleware,
// //   validateInvestment,
// //   investmentController.invest
// // );

// // Browse investment products
// router.get('/products', investmentController.getProducts);
// router.get('/products/:id', investmentController.getProductDetails);

// // Investment actions
// router.post('/invest', authMiddleware, validateInvestment, investmentController.invest);
// router.post('/liquidate/:id', authMiddleware, investmentController.liquidate);

// // Portfolio management
// router.get('/portfolio', authMiddleware, investmentController.getPortfolio);
// router.get('/portfolio/performance', authMiddleware, investmentController.getPerformance);

// // Fractional investing
// router.post('/fractional/invest', authMiddleware, investmentController.fractionalInvest);

// module.exports = router;

const express = require('express');
const router = express.Router();

const investmentController = require('../Controllers/investmentController');
const { authMiddleware } = require('../middleware/auth');
const { validateInvestment } = require('../validators/investment');
const { getAIRecommendations } = require('../Controllers/investmentAIController');

console.log('liquidate is:', typeof investmentController.liquidate);
console.log('getPerformance is:', typeof investmentController.getPerformance);
console.log('getPortfolio is:', typeof investmentController.getPortfolio);


// Investment actions
router.post('/invest', authMiddleware, validateInvestment, investmentController.createInvestment);
router.post('/liquidate/:id', authMiddleware, investmentController.liquidate);

// Browse investment products
router.get('/products', investmentController.getProducts);
router.get('/products/:id', investmentController.getProductDetails);
router.post('/ai-recommend', getAIRecommendations);

// Portfolio management
router.get('/portfolio', authMiddleware, investmentController.getPortfolio);
router.get('/portfolio/performance', authMiddleware, investmentController.getPerformance);

// Fractional investing
router.post('/fractional/invest', authMiddleware, investmentController.fractionalInvest);

module.exports = router;

