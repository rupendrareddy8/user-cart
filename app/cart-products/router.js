const config = require('../config/routes.js');
const router = config.express.Router();
const collection = require('./model.js');
const functions = require('./functions.js');
const cartFunctions = require('../cart/functions.js');
const verifyToken = require('../auth.js')


router.post('/create-cart-product',verifyToken,  async function(req, res) {
  try {
    if(!req.body.quantity) return res.status(400).send({message: "Please provide quantity"})

    if(!req.body.amount) return res.status(400).send({message: "Please provide amount"})

    if(!req.body.cart_id) return res.status(400).send({message: "Please provide cart ID"})

    if(!req.body.product_id) return res.status(400).send({message: "Please provide product ID"})

    let data = {
      quantity: req.body.quantity,
      netAmount: req.body.amount,
      cartId: req.body.cart_id,
      productId: req.body.product_id
    }

    let cartProduct = await functions.createCartProduct(data)
    try{
      let query = {
        _id: cartProduct.cartId
      }

      let cartUpdateData = {
        $inc: {netAmount: cartProduct.netAmount, totalQuantity: cartProduct.quantity},
        $push: {
          products: {
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            price: cartProduct.netAmount,
            cartProductId: cartProduct._id
          }
        }
      }
      let cartUpdate = await cartFunctions.updateCart(query, cartUpdateData)
    } catch(e) {
      return res.status(201).send({message: "Cart product created, But cart was not updated"})
    }
    return res.status(201).send({message: "Successfully added product to cart", data: cartProduct})
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while creating cart-product. Please try again later"})
  }
})


router.get('/all-cart-products', verifyToken, async function(req, res) {
  try {
    // Create Options
    let options = { sort: '-createdAt' };
    options.page = (req.query.page)? Number(req.query.page): 1;
    options.limit = (req.query.limit)? Number(req.query.limit): 20;
    options.lean = true

    //Create Query
    let query = {}

    let cartProducts = await functions.getCartProducts(query, options)
    return res.status(200).send(cartProducts)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching cart products"})
  }
})


//Api to get cart details
router.get('/get-cart-product-details/:id', verifyToken, async function(req, res) {
  try {
    if(!req.params.id) return res.status(400).send({message: "Please provide Product ID"})

    let query = {
      _id: req.params.id
    }

    let cartProductDetails = await functions.getCartProductDetails(query)
    return res.status(200).send(cartProductDetails)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching cart product details. Please try again later"})
  }
})

module.exports = router;

