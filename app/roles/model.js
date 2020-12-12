const mongoose = require('mongoose')
const config = require('../config/model.js');
config.increment.initialize(config.db);

const rolesSchema = new config.mongoose.Schema({
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

rolesSchema.plugin(config.paginate);
module.exports = config.mongoose.model('roles',rolesSchema)