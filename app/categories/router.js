const config = require('../config/routes.js');
const router = config.express.Router();
const functions = require('./functions.js')
const verifyToken = require('../auth.js')


router.post('/create-category', verifyToken, async function(req, res) {
  try {
    if(!req.body.name) return res.status(400).send({message: "Please provide Category name"})

    let data = {
      name: req.body.name
    }

    let category = await functions.createCategory(data)
    return res.status(201).send({message: "Category created successfully", data: category})
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while creating category. Please try again later"})
  }
})


//Api to get all categories
router.get('/get-categories', verifyToken, async function(req, res) {
  try {
    // Create Options
    let options = { sort: '-createdAt' };
    options.page = (req.query.page)? Number(req.query.page): 1;
    options.limit = (req.query.limit)? Number(req.query.limit): 20;
    options.lean = true

    //Create Query

    let query = {}

    if(req.query.name) query["name"] = { $regex: `^${req.query.name}`}

    let categories = await functions.getCategories(query, options)
    return res.status(200).send(categories)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching categories"})
  }
})


//Api to get category details
router.get('/get-category-details/:id', verifyToken, async function(req, res) {
  try {
    if(!req.params.id) return res.status(400).send({message: "Please provide User id"})

    let query = {
      _id: req.params.id
    }

    let userDetails = await functions.getCategoryDetails(query)
    return res.status(200).send(userDetails)
  } catch(e) {
    return res.status(400).send({message: "Error occured while fetching user details"})
  }
})


module.exports = router
