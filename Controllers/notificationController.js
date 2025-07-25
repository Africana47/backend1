const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a notification (for a user or broadcast)
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type = 'info', broadcast = false } = req.body;

    if (broadcast) {
      const users = await User.find({}, '_id');
      const notifications = users.map(user => ({
        user: user._id,
        title,
        message,
        type,
      }));
      await Notification.insertMany(notifications);
      return res.status(201).json({ message: 'Broadcast sent to all users.' });
    }

    if (!userId) return res.status(400).json({ message: 'User ID is required unless broadcast is true.' });

    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    res.status(201).json({ message: 'Notification sent.', notification });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Failed to send notification.' });
  }
};

// Get all notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ count: notifications.length, notifications });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read.' });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ message: 'Notification deleted.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification.' });
  }
};
