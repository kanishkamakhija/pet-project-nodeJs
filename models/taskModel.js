const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {
        type: String, 
        required: true, 
        trim: true
    },
    completed: {
        type: Boolean, 
        default: false
    },
    username: {
        type: String, 
        required: true, 
        trim: true
    }

});

module.exports = Task