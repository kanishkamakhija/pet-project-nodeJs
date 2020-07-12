const router = require(".");
const express = require('express');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

router.post('/signIn', async (req, res, next) => {
    try {
        UserModel.findOne({email: req.body.email}, function(err, user) {
            console.log("^^^", user);
            if(err) throw err;
            if( !user || !user.comparePassword(req.body.password) ) {
                res.status(401).send({message: 'Authentication failed. Invalid user or password.'});
            }
            res.status(201).send({ token: jwt.sign({ email: user.email, fullName: user.username, _id: user._id }, 'RESTFULAPIs') });
        })
    } catch (error) {
        response.status(500).send(error);
    }  
});

module.exports = router;