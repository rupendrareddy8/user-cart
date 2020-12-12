const mongoose = require('mongoose')
const config = require('../config/model.js');
config.increment.initialize(config.db);

const cartSchema = new config.mongoose.Schema({
  totalQuantity: {
  	type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  userId: {
    type: config.mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  products: [{
    productId: {
      type: config.mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    cartProductId: {
      type: config.mongoose.Schema.Types.ObjectId,
      ref: 'cart-products'
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartSchema.plugin(config.paginate);
module.exports = config.mongoose.model('carts',cartSchema)
