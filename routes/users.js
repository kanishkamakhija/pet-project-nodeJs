let express = require('express');
let router = express.Router();
let { getUserDetails, updateUserPassword} = require('./../services/userService');

/* GET users listing. */
router.post('/', async(req, res, next) => {
  let uname = req.body.username;
  let pwd = req.body.password;
  let userDetails = await getUserDetails(req.db, uname);
  if(userDetails) {
    let { password } = userDetails;
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
