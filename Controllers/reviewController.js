// controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');

exports.submitReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ message: 'Review submitted', data: review });
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json({ data: reviews });
  } catch (err) {
    console.error('Review fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
