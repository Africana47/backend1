const express = require('express');
const router = express.Router();
const {
  uploadKycDocument,
  downloadKycDocument,
  generatePortfolioReport
} = require('../Controllers/documentController');

// const { protect } = require('../middleware/authMiddleware');
const { authMiddleware } = require('../middleware/auth');

router.post('/kyc',  uploadKycDocument);
router.get('/kyc',  downloadKycDocument);
router.get('/portfolio-report', generatePortfolioReport);

module.exports = router;
