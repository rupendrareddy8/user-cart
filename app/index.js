const express = require('express');

// Routes Import
const roles = require("./roles/index.js");
const users = require("./users/index.js");
const categories = require("./categories/index.js");
const products = require("./products/index.js");
const cart = require("./cart/index.js");
const cartProducts = require("./cart-products/index.js");

const router = express.Router();

// Adding Routes
router.use('/roles', roles);
router.use('/users', users);
router.use('/categories', categories);
router.use('/products', products);
router.use('/cart', cart);
router.use('/cart-products', cartProducts);

module.exports = router
