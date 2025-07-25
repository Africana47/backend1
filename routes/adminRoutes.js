
const express = require('express');
const router = express.Router();

const adminController = require('../Controllers/adminController');
const { authMiddleware } = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

console.log('getDashboard is:', typeof adminController.getDashboard);
console.log('authMiddleware is:', typeof authMiddleware);
console.log('adminMiddleware is:', typeof adminMiddleware);
console.log('adminController.getDashboard exists?', !!adminController.getDashboard);



router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboard);
// User management
router.get('/users', adminMiddleware, adminController.getAllUsers);
router.patch('/users/:id/status', adminMiddleware, adminController.updateUserStatus);

// KYC approvals
// router.get('/kyc/pending', adminMiddleware, adminController.getPendingKYC);
// router.post('/kyc/approve/:userId', adminMiddleware, adminController.approveKYC);

// Investment management
// router.post('/products', adminMiddleware, adminController.createProduct);
// router.patch('/products/:id', adminMiddleware, adminController.updateProduct);

// Risk pool management
// router.get('/risk-pool', adminMiddleware, adminController.getRiskPoolStatus);
// router.post('/risk-pool/adjust', adminMiddleware, adminController.adjustRiskPool);

// Platform analytics
// router.get('/analytics', adminMiddleware, adminController.getPlatformAnalytics);

module.exports = router;