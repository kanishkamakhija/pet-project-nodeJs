let express = require('express');
const { getUserDetails, updateUserPassword } = require('../services/userService');
let router = express.Router();

router.put('/password', async(req, res, next) => {
    try{
        let oldPwd = req.body.old_password;
        let newPwd = req.body.new_password;
        if(!oldPwd && !newPwd) {
            res.status(404).send({status: 401, error: "Invalid Parameters"});
        }
         let uname = req.session.userData.usrname;
         let userDetails = await getUserDetails(req.db, uname);
         if(oldPwd !== userDetails.password) {
            res.status(404).send({status: 401, error: "Old password does not match "});
         } else {
             let updateRes = await updateUserPassword(req.db, uname, newPwd);
             res.data = {message: "Password updated successfully"}
         }
         next();
    } catch(e) {
        next(e);
    }
})