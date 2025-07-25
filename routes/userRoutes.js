const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// Add these two 👇
router.get('/dashboard', authMiddleware, userController.getDashboard);
router.get('/profile', authMiddleware, userController.getProfile); // Optional alias for /me

// Existing routes
router.get('/me', authMiddleware, userController.getProfile);
router.patch('/me', authMiddleware, userController.updateProfile);
router.post('/risk-assessment', authMiddleware, userController.assessRisk);

module.exports = router;
