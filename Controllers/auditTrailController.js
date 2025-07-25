// controllers/auditTrailController.js
const AuditLog = require('../models/AuditLog');

exports.logAction = async (req, res) => {
  try {
    const { action, description } = req.body;

    const log = new AuditLog({
      user: req.user.id,
      action,
      description,
      ipAddress: req.ip
    });

    await log.save();

    res.status(201).json({ message: 'Action logged' });
  } catch (err) {
    console.error('Audit log error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ data: logs });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
