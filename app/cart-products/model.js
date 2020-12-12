const mongoose = require('mongoose')
const config = require('../config/model.js');
config.increment.initialize(config.db);

const cartProductSchema = new config.mongoose.Schema({
  quantity: {
  	type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  cartId: {
    type: config.mongoose.Schema.Types.ObjectId,
    ref: 'carts'
  },
  productId: {
    type: config.mongoose.Schema.Types.ObjectId,
    ref: 'products'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cartProductSchema.plugin(config.paginate);
module.exports = config.mongoose.model('cart-products',cartProductSchema)
