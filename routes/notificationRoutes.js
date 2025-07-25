const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get user's notifications
router.get('/', authMiddleware, notificationController.getNotifications);

// Mark as read
router.patch('/:id/read', authMiddleware, notificationController.markAsRead);

// Delete
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

// Send or broadcast
router.post('/send', authMiddleware, adminMiddleware, notificationController.sendNotification);

module.exports = router;
