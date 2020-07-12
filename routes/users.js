let express = require('express');
let router = express.Router();
let { getUserDetails, updateUserPassword} = require('./../services/userService');
let User = require('../models/userModel');

/* GET users listing. */
router.post('/', async(req, res, next) => {
  req.session = {};
  let uname = req.body.username;
  let pwd = req.body.password;
  let newUser = new User({username: uname, password: pwd});
  let result = await newUser.save();
  // let userDetails = await getUserDetails(req.db, uname);
  console.log("SUCCESS", result);
  res.status(201).send({message : "User Created"});
  if(!result.errors) {
    console.log("req--", req, "res---",res);
    let { password } = result;
    if(pwd === password) {
      // res.data = userDetails;
      res.data = { user: "kmakh"};
      // req.session.userData = userDetails;
      req.session.userData = { user: "kmakh"};
    } else {
      res.status = 400;
      res.data = {
        status: false,
      error: "Invalid Password"
      }
    }
  } else {
    res.status = 400;
      res.data = {
        status: false,
      error: "Invalid Username"
      }
  }
  next();
});

module.exports = router;
