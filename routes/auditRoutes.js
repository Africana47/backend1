const express = require('express');
const router = express.Router();
const { logAction, getAuditLogs } = require('../Controllers/auditTrailController');
// const { adminOnly } = require('../middleware/auth');

const { authMiddleware } = require('../middleware/auth');

// User creates log
router.post('/', logAction);

// Admin views logs
router.get('/', getAuditLogs);

module.exports = router;
