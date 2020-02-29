const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    state: String,
    role: String,
})

module.exports = mongoose.model('AuthorisedUsers', userSchema);
