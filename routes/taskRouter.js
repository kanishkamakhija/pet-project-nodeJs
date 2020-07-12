const router = require(".");
const express = require('express');
// const router = express.Router();
const Task = require('../models/taskModel');

router.post('/task', async (req, res, next) => {
    let task = new Task(req.body);
    await task.save();
    res.status(201).send({message : "Task Created"});
});

router.get('/task', async (req, res, next) => {
    let tasks = await Task.find({});
    res.status(200).send({message : "Task Fetched", data: tasks});
});

module.exports = router;