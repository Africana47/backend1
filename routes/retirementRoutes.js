const express = require('express');
const router = express.Router();
const retirementController = require('../Controllers/retirementController');
const { authMiddleware } = require('../middleware/auth');

console.log('authMiddleware is:', typeof authMiddleware);
console.log('createPlan is:', typeof retirementController.createPlan);
console.log('authMiddleware is:', typeof authMiddleware); // ✅ should show "function"
console.log('contribute is:', typeof retirementController.contribute);
console.log('getProjections is:', typeof retirementController.getProjections);
console.log('withdraw is:', typeof retirementController.withdraw);
console.log('getTaxAdvice is:', typeof retirementController.getTaxAdvice);
console.log('getMyPlans is:', typeof retirementController.getMyPlans);

// Retirement planning
router.post('/create', authMiddleware, retirementController.createPlan); // Changed from /plan to /create
router.get('/projections', authMiddleware, retirementController.getProjections);
router.get('/my-plans', authMiddleware, retirementController.getMyPlans);

// Retirement account actions
router.post('/contribute', authMiddleware, retirementController.contribute);
router.post('/withdraw', authMiddleware, retirementController.withdraw);

// Tax optimization
router.get('/tax-optimization', authMiddleware, retirementController.getTaxAdvice);

module.exports = router;