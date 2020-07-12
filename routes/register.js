const router = require(".");
const express = require('express');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res, next) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        var user = new UserModel(req.body);
        var result = await user.save();
        res.status(201).send({message : "User Added", result: result});
    } catch (error) {
        response.status(500).send(error);
    }  
});



module.exports = router;