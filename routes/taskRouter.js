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

router.get('/task/:id', async (req, res, next) => {
    if (req.user) {
      let task = await Task.find({_id : req.params.id, username: req.user.fullName})
      if(task.length > 0){
        // let tasks = await Task.find({username : req.user.fullName}); 
        res.status(200).send({message : "Task Fetched", data: task});
      } else {
        res.status(401).send({message : 'You don\'t have acces to task for this id!!'});
      }
    } else {
          res.status(401).send({message : 'Unauthorized user!!'});
      }
    
});

router.get('/task', async (req, res, next) => {
  if (req.user) {
      let tasks = await Task.find({username : req.user.fullName});
      res.status(200).send({message : "All Tasks Fetched", data: tasks});
  } else {
        res.status(401).send({message : 'Unauthorized user!!'});
    }
  
});

module.exports = router;