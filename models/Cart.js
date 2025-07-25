// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, required: true },
//   quantity: { type: Number, required: true, min: 1 },
//   price: { type: Number, required: true, min: 0 },
// });

// // Each user has one cart document containing an array of cart items
// const cartSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//   items: [cartItemSchema],
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Cart', cartSchema);

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  price: { 
    type: Number, 
    required: true 
  },
  variant: { 
    type: String 
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  items: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
