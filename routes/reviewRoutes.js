const express = require('express');
const router = express.Router();
const { submitReview, getProductReviews } = require('../Controllers/reviewController');
// const { protect } = require('../middleware/authMiddleware');
const {authMiddleware} = require('../middleware/auth');


console.log('reviewController exports:', require('../Controllers/reviewController'));
console.log('submitReview exists?', typeof submitReview === 'function');
console.log('getProductReviews exists?', typeof getProductReviews === 'function');

// Submit a review
router.post('/', authMiddleware, submitReview);

// Get reviews for a product
router.get('/:productId', getProductReviews);

module.exports = router;
