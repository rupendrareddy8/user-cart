const collection = require('./model.js')

function createRole(data) {
  return new Promise(function(resolve, reject) {
    //saving role in db
    collection.create(data, function(err, response) {
      if(err) return reject({message: "Something went wrong while creating Role"})
      return resolve(response)
    })
  })
}

function getRoles(query, options) {
  return new Promise(function(resolve, reject) {
    collection.paginate(query, options, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching records"})
      if(!response.docs.length) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

function gertRoleDetails(query, projections={}) {
  return new Promise(function(resolve, reject) {
    collection.findById(query, projections, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching role details"})
      if(!response) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

module.exports = {
  createRole,
  getRoles,
  gertRoleDetails
}