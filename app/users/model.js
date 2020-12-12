const mongoose = require('mongoose')
const config = require('../config/model.js');
config.increment.initialize(config.db);
const roleSchema = require('../roles/model.js')

const userSchema = new config.mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roleId: {
    type: config.mongoose.Schema.Types.ObjectId,
    ref: 'roles'
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

userSchema.plugin(config.paginate);
module.exports = config.mongoose.model('users',userSchema)