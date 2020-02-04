const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    }
})

userSchema.methods.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

/**
 * @description Hashes the password before saving
 */
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(10)
        .then(salt => {
            bcrypt.hash(this.password, salt)
                .then(hash => {
                    this.password = hash;
                    next();
                })
                .catch(error => { return next(error) });
        }).catch(error => { return next(error) })
});

module.exports = mongoose.model('User', userSchema)