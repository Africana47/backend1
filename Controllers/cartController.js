const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Joi = require('joi');

// Validation schemas
const addItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).default(1),
  variant: Joi.string().optional()
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required()
});

// Get or create user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Calculate totals
    const cartData = calculateCartTotals(cart);

    res.json(cartData);
  } catch (err) {
    
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    // Validate input
    const { error, value } = addItemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check product exists and is available
    const product = await Product.findById(value.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < value.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === value.productId && 
             item.variant === value.variant
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += value.quantity;
    } else {
      // Add new item
      cart.items.push({
        product: value.productId,
        quantity: value.quantity,
        variant: value.variant,
        price: product.price // Store price at time of addition
      });
    }

    await cart.save();
    const cartData = calculateCartTotals(cart);

    res.status(201).json({
      message: 'Item added to cart',
      cart: cartData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
exports.updateItem = async (req, res) => {
  try {
    const { error, value } = updateItemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check product stock if increasing quantity
    if (value.quantity > cart.items[itemIndex].quantity) {
      const product = await Product.findById(cart.items[itemIndex].product);
      const quantityIncrease = value.quantity - cart.items[itemIndex].quantity;
      if (product.stock < quantityIncrease) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    }

    // Remove if quantity is 0, otherwise update
    if (value.quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = value.quantity;
    }

    await cart.save();
    const cartData = calculateCartTotals(cart);

    res.json({
      message: 'Cart updated',
      cart: cartData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json({
      message: 'Cart cleared',
      cart: {
        items: [],
        subTotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate cart totals
function calculateCartTotals(cart) {
  let subTotal = 0;
  let itemCount = 0;

  // Calculate subtotal and count
  cart.items.forEach(item => {
    subTotal += item.price * item.quantity;
    itemCount += item.quantity;
  });

  // Calculate tax (example: 10% tax)
  const taxRate = 0.1;
  const tax = subTotal * taxRate;
  const total = subTotal + tax;

  return {
    _id: cart._id,
    user: cart.user,
    items: cart.items,
    subTotal: parseFloat(subTotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemCount,
    updatedAt: cart.updatedAt
  };
}