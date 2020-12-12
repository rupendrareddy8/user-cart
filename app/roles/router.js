const config = require('../config/routes.js');
const router = config.express.Router();
const collection = require('./model.js');
const functions = require('./functions.js');
const verifyToken = require('../auth.js')


//Api to create new role
router.post('/create-role', async function(req, res) {
  try {
    if(!req.body.role_name) return res.status(400).send({message: "Please provide Role Name"})

    let data = {
      name: req.body.role_name
    }

    //saving role
    let createRole = await functions.createRole(data)
    return res.status(201).send({message: "Role create successfully", data: createRole})
  } catch(e) {
    console.log(e)
    return res.status(400).send({message: "Something went wrong. Please try again later"})
  }
})


//Api to get roles with pagination
router.get('/get-roles', verifyToken, async function(req, res) {
  try {

    // Create Options
    let options = { sort: '-createdAt' };
    options.page = (req.query.page)? Number(req.query.page): 1;
    options.limit = (req.query.limit)? Number(req.query.limit): 20;
    options.lean = true

    //Create Query

    let query = {}

    if(req.query.name) query["name"] = { $regex: `^${req.query.name}`}

    let roles = await functions.getRoles(query, options)
    return res.status(200).send(roles)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching roles. Please try again later"})
  }
})


//Api to get role details
router.get('/get-role-details/:id', verifyToken, async function(req, res) {
  try {
    if(!req.params.id) return res.status(400).send({message: "Please provide Role ID"})

    let query = {
      _id: req.params.id
    }

    let roleDetails = await functions.gertRoleDetails(query)
    return res.status(200).send(roleDetails)
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while fetching role details. Please try again later"})
  }
})


module.exports = router


