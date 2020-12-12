const collection = require('./model.js')

function createProduct(data) {
  return new Promise(function(resolve, reject) {
    //saving role in db
    collection.create(data, function(err, response) {
      if(err) return reject({message: "Something went wrong while creating product"})
      return resolve(response)
    })
  })
}

function getProducts(query, options) {
  return new Promise(function(resolve, reject) {
    collection.paginate(query, options, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching records"})
      if(!response.docs.length) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

function gertProductDetails(query, projections={}) {
  return new Promise(function(resolve, reject) {
    collection.findById(query, projections, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching product details"})
      if(!response) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

function updateProduct(query, updateData) {
  return new Promise(function(resolve, reject) {
    collection.findOneAndUpdate(query, updateData, {new: true}, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching product details"})
      if(!response) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

module.exports = {
  createProduct,
  getProducts,
  gertProductDetails,
  updateProduct
}