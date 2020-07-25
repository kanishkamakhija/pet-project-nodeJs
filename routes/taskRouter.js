const router = require(".");
const express = require('express');
const Task = require('../models/taskModel');

router.post('/task', async (req, res, next) => {
    if (req.user) {
        req.body.username = req.user.fullName;
        let task = new Task(req.body);
        await task.save();
        res.status(201).send({message : "Task Created"});
      } else {
        res.status(401).send({message : 'Unauthorized user!!'});
      }
    
});

router.get('/task', async (req, res, next) => {
    if (req.user) {
        let tasks = await Task.find({username : req.user.fullName});
        res.status(200).send({message : "Task Fetched", data: tasks});
    } else {
        res.status(401).send({message : 'Unauthorized user!!'});
      }
    
});

module.exports = router;