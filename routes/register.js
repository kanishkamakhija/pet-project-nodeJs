const router = require(".");
const express = require('express');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
    try {
        let isUser = await UserModel.find({email : req.body.email});
        if(isUser){
            res.status(200).send({message : "User Already Exsist",});
        } else {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            var user = new UserModel(req.body);
            var result = await user.save();
            res.status(201).send({message : "User Added", result: result});
        }
        
    } catch (error) {
        res.status(500).send(error);
    }  
});



module.exports = router;