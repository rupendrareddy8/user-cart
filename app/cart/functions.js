const collection = require('./model.js');


function createCart(data) {
  return new Promise(function(resolve, reject) {
    collection.create(data, function(err, response) {
      if(err) return reject({message: "Something went wrong while creating cart"})
      return resolve(response)
    })
  })
}

function getCarts(query, options) {
  return new Promise(function(resolve, reject) {
    collection.paginate(query, options, function(err, response) {
      if(err) return reject({message: "Something went wrong"})
      if(!response.docs.length) return reject({message: "No data Found"})
      return resolve(response)
    })
  })
}

function getCartDetails(query, projections={}) {
  return new Promise(function(resolve, reject) {
    collection.findById(query, projections, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching data"})
      if(!response) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

function updateCart(query, updateData) {
  return new Promise(function(resolve, reject) {
    collection.findOneAndUpdate(query, updateData, {new: true}, function(err, response) {
      if(err) return reject({message: "Something went wrong while updating cart"})
      if(!response) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}
module.exports = {
  createCart,
  getCarts,
  getCartDetails,
  updateCart
}