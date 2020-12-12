const mongoose = require('mongoose')
const config = require('../config/model.js');
config.increment.initialize(config.db);

const productsSchema = new config.mongoose.Schema({
  name: {
  	type: String,
  	required: true,
  	unique: true
  },
  price: {
  	type: Number,
  	required: true
  },
  quantity: {
  	type: Number,
  	required: true
  },
  categoryId: {
    type: config.mongoose.Schema.Types.ObjectId,
    ref: 'categories'
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

productsSchema.plugin(config.paginate);
module.exports = config.mongoose.model('products',productsSchema)