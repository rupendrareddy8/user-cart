const config = require('../config/routes.js');
const collection = require('./model.js')
const router = config.express.Router();
const functions = require('./functions.js')
const validators = require('./validators.js')
const bcrypt = require('bcrypt');
const secret = "$rudil#5672"
const jwt = require('jsonwebtoken')
const verifyToken = require('../auth.js')

//Api to create a new user
router.post('/create-user', async function(req, res) {
  try {

    //validationg the request data
    const { errors, isValid } = validators.userValidator(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //password hashing
    let hashedPassword = bcrypt.hashSync(req.body.password, 8);

    let dataObj = {
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hashedPassword,
      roleId: req.body.role_id
    }

    let user = await functions.createUser(dataObj)
    return res.status(201).send({message: "User created successfully", data: user})
  } catch(e) {
    return res.status(400).send({message: "Something went wrong while creating user. Please try again later"})
  }
})


//Api to login
router.post('/login', function(req, res, next) {
  if(!req.body.email || !req.body.password) return res.status(400).send({message: "Please provide valid E-mail and password"})
  collection.findOne({email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error occured. Please try again later.');
    if (!user) return res.status(404).send('No user found.');
    
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    let token = jwt.sign({ id: user._id }, secret);
    return res.status(200).send({message: "Successfully logged in", token: token})
  });
})


//Api to get all registered users data
router.get('/users', verifyToken, async function(req, res) {
  try {
  // Create Options
  let options = { sort: '-createdAt' };
  options.page = (req.query.page)? Number(req.query.page): 1;
  options.limit = (req.query.limit)? Number(req.query.limit): 20;
  options.lean = true

  //Create Query

  let query = {}

  //search by mobile number
  if(req.query.mobile) query["mobile"] = { $regex: `^${req.query.mobile}`}

  //Query to get user's data

  let users = await functions.getUsers(query, options)
  return res.status(200).send(users)
} catch(e) {
  return res.status(400).send({message: "Something went wrong while Fetching users. Please try again later"})
}
})


//Api to get user details
router.get('/get-user-details/:id', verifyToken, async function(req, res) {
  try {
    if(!req.params.id) return res.status(400).send({message: "Please provide User id"})

    let query = {
      _id: req.params.id
    }

    let projections = {password: 0}
    let userDetails = await functions.getUser(query, projections)
    return res.status(200).send(userDetails)
  } catch(e) {
    return res.status(400).send({message: "Error occured while fetching user details"})
  }
})


module.exports = router



