const collection = require('./model.js')


//create new user
function createUser(data) {
  return new Promise(function(resolve, reject) {
    collection.create(data, function(err, response) {
      if(err) return reject({message: "Something went wrong while creating user"})
      return resolve(response)
    })
  })
}

//function to get single user
function getUser(query, projections={}) {
  return new Promise(function(resolve, reject) {
    collection.findById(query, projections, function(err, response) {
      if(err) return reject({message: "Something went wrong while fetching data"})
      if(!response) return reject({message: "No data found"})
      return resolve(response)
    })
  })
}

function getUsers(query, options) {
	return new Promise(function(resolve, reject) {
    collection.paginate(query, options, function(err, response) {
	    if(err) return reject({message: "Something went wrong"})
	    if(!response.docs.length) return reject({message: "No data Found"})
	    return resolve(response)
	  })
  })
}

module.exports = {
	createUser,
  getUser,
  getUsers
}