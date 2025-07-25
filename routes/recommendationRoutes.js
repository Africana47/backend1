const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../Controllers/recommendationController');
// const { protect } = require('../middleware/authMiddleware');
const {authMiddleware} = require('../middleware/auth');
router.get('/', getRecommendations);

module.exports = router;
