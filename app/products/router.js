const config = require('../config/routes.js');
const router = config.express.Router();
const collection = require('./model.js');
const functions = require('./functions.js');
const verifyToken = require('../auth.js')
const users = require('../users/functions.js');
const roleFunctions = require('../roles/functions.js')


router.post('/create-product', verifyToken, async function(req, res) {
  try {
    if(!req.body.name) return res.status(400).send({message: "Please provide product name"})

    if(!req.body.price) return res.status(400).send({message: "Please provide Price of the product"})

    if(!req.body.quantity) return res.status(400).send({message: "Please provide quantity of the product"})

    if(!req.body.category_id) return res.status(400).send({message: "Please provide Category of the product"})
    let data = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      categoryId: req.body.category_id
    }

    let product = await functions.createProduct(data)
    return res.status(201).send({message: "Product created successfully", data: product})
  } catch(e) {
    return res.status(400).send({message: "Error occured while creating product. Please try again later"})
  }
})


//Api to get all products with pagination
router.get('/all-products', verifyToken, async function(req, res) {
  try {

    // Create Options
    let options = { sort: '-createdAt' };
    options.page = (req.query.page)? Number(req.query.page): 1;
    options.limit = (req.query.limit)? Number(req.query.limit): 20;
    options.lean = true

    //Create Query

    let query = {}

    if(req.query.name) query["name"] = { $regex: `^${req.query.name}`}

    let roles = await functions.getProducts(query, options)
    return res.status(200).send(roles)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching products. Please try again later"})
  }
})


//Api to get product details
router.get('/get-product-details/:id', verifyToken, async function(req, res) {
  try {
    if(!req.params.id) return res.status(400).send({message: "Please provide Product ID"})

    let query = {
      _id: req.params.id
    }

    let productDetails = await functions.gertProductDetails(query)
    return res.status(200).send(productDetails)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching product details. Please try again later"})
  }
})


//Api to update product details
router.put('/update-product', verifyToken, async function(req, res) {
  try {
    if(!req.body.product_id) return res.status(400).send({message: "Please provide product ID"})
    let userDetails = await users.getUser({_id: req.userId}, {password: 0})
    let roleDetails = await roleFunctions.gertRoleDetails({_id: userDetails.roleId})

    if(roleDetails.name != "merchant") return res.status(400).send({message: "You're not authorized to update product details"})

    let updateData = {
      $set: {}
    }
    if(req.body.quantity) updateData["$set"]["quantity"] = req.body.quantity

    if(req.body.price) updateData["$set"]["price"] = req.body.price

    if(req.body.name) updateData["$set"]["name"] = req.body.name
    let query = {
      _id: req.body.product_id
    }
    let updateProduct = await functions.updateProduct(query, updateData)
    return res.status(200).send({message: "Product details updated successfully", data: updateProduct})
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while updating product details"})
  }
})

module.exports = router

