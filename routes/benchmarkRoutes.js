const express = require('express');
const router = express.Router();
const { getBenchmarkComparison } = require('../Controllers/benchmarkController');
// const { protect } = require('../middleware/authMiddleware');
const {authMiddleware} = require('../middleware/auth');
router.get('/', getBenchmarkComparison);

module.exports = router;
