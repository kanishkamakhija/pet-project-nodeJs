const mongoose = require('mongoose');

const User = mongoose.model('User', {
    username: {
        type: String, 
        required: true, 
        trim: true
    },
    password: {
        type: String, 
        required: true, 
        trim: true
    }

});

module.exports = User;
