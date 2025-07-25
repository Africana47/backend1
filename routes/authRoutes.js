// const express = require('express');
// const { register, login } = require('../controllers/authController');
// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const authController = require('../Controllers/authController');
// const { validateRegister, validateLogin } = require('../validators/auth');
// const {authMiddleware} = require('../middleware/authMiddleware');
// const uploadKYC = require('../middleware/kycUpload');

// // User registration
// router.post('/register', validateRegister, authController.register);

// // User login
// router.post('/login', validateLogin, authController.login);

// // Email verification
// router.get('/verify-email/:token', authController.verifyEmail);

// // Password reset
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password/:token', authController.resetPassword);

// // KYC submission
// router.post('/ kyc', authMiddleware, uploadKYC.single('document'), authController.submitKYC);

// module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { validateRegister, validateLogin } = require('../validators/auth');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadKYC = require('../middleware/kycUpload');
const { validationResult } = require('express-validator');

// Validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 🔐 User Registration
router.post('/register', validateRegister, validate, authController.register);

// 🔐 User Login
router.post('/login', validateLogin, validate, authController.login);

// ✅ Email Verification
// router.get('/verify-email/:token', authController.verifyEmail);

// 🔑 Forgot and Reset Password
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password/:token', authController.resetPassword);

// 📄 KYC Document Submission (Protected Route)
// router.post(
//   '/kyc',
//   authMiddleware,
//   uploadKYC.single('document'),
//   authController.submitKYC
// )//////////

module.exports = router;

