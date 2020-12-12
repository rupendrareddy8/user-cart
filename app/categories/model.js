const mongoose = require('mongoose')
const config = require('../config/model.js');
config.increment.initialize(config.db);

const categoriesSchema = new config.mongoose.Schema({
  name: {
  	type: String,
    required: true,
  	unique: true
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

categoriesSchema.plugin(config.paginate);
module.exports = config.mongoose.model('categories',categoriesSchema)