// router.get('/', auth, cartController.getCart);
// router.post('/items', auth, cartController.addItem);
// router.put('/items/:itemId', auth, cartController.updateItem);
// router.delete('/', auth, cartController.clearCart);

const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');
const { authMiddleware } = require('../middleware/auth');



// Cart management
router.get('/', authMiddleware, cartController.getCart);
router.post('/items', authMiddleware, cartController.addItem);
router.put('/items/:id', authMiddleware, cartController.updateItem);
// router.delete('/items/:id', authMiddleware, cartController.removeItem);

// Checkout process
// router.post('/checkout', authMiddleware, cartController.checkout);
// router.post('/apply-promo', authMiddleware, cartController.applyPromoCode);

module.exports = router;