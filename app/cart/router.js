const config = require('../config/routes.js');
const router = config.express.Router();
const collection = require('./model.js');
const functions = require('./functions.js');
const cartProductFunctions = require('../cart-products/functions.js');
const verifyToken = require('../auth.js')

router.post('/create-cart', verifyToken, async function(req, res) {
  try {

    if(!req.body.total_quantity) return res.status(400).send({message: "Please provide total quantity"})

    if(!req.body.net_amount) return res.status(400).send({message: "Please provide total amount"})

    if(!req.body.user_id) return res.status(400).send({message: "Please provide user Id"})
    
    if(!req.body.products) return res.status(400).send({message: "Please provide products"})    

    let data = {
      totalQuantity: req.body.total_quantity,
      netAmount: req.body.net_amount,
      userId: req.body.user_id
    }

    let requestedProducts = req.body.products
    let products = []
    requestedProducts.forEach(product => {
      let productDetails = {
        productId: product.product_id,
        quantity: product.quantity,
        price: product.price
      }
      products.push(productDetails)
    })

    data.products = products

    let cart = await functions.createCart(data)

    async function loop() {
      for await(const product of cart.products) {
        let cartProductData = {
          quantity: product.quantity,
          netAmount: product.price,
          cartId: cart._id,
          productId: product.productId
        }

        try {
          let cartProduct = await cartProductFunctions.createCartProduct(cartProductData)
          let updateQuery = {
            "products._id": product._id
          }
          let cartUpdateData = {
            $set: {
              "products.$.cartProductId": cartProduct._id
            }
          }

          let cartUpdate = await functions.updateCart(updateQuery, cartUpdateData)
        } catch(e) {
          console.log("cart created, But cart product is not created")
        }
      }
    }
    loop()
    return res.status(201).send({message: "Cart created successfully", data: cart})
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while creating cart. Please try again later"})
  }
})


router.get('/get-carts', verifyToken, async function(req, res) {
  try {
    // Create Options
    let options = { sort: '-createdAt' };
    options.page = (req.query.page)? Number(req.query.page): 1;
    options.limit = (req.query.limit)? Number(req.query.limit): 20;
    options.lean = true

    //Create Query
    let query = {}

    let carts = await functions.getCarts(query, options)
    return res.status(200).send(carts)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching carts"})
  }
})


//Api to get cart details
router.get('/get-cart-details/:id', verifyToken, async function(req, res) {
  try {
    if(!req.params.id) return res.status(400).send({message: "Please provide Product ID"})

    let query = {
      _id: req.params.id
    }

    let cartDetails = await functions.getCartDetails(query)
    return res.status(200).send(cartDetails)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching cart details. Please try again later"})
  }
})

module.exports = router;


