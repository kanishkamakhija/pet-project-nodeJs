const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// const User = mongoose.model('User', {
//     username: {
//         type: String, 
//         required: true, 
//         trim: true
//     },
//     password: {
//         type: String, 
//         required: true, 
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     created: {
//         type: Date,
//         default: Date.now
//       }

// });
// module.exports = User;

var UserSchema = new Schema({
        username: {
        type: String,
        required: true,
        trim: true
    },
        password: {
        type: String,
        required: true,
        trim: true
    },
        email: {
        type: String,
        required: true
    },
        created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.comparePassword = function(password) {
return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
