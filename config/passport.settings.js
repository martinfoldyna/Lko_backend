const LocalStrategy = require('passport-local').Strategy;
const User = require('./../models/user.model');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    })
    passport.deserializeUser((user, done) => {
        done(null, user);
    })

    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({username: username}).exec()
            .then((user) => {
                if(!user) return done(null, false, {message: 'Uživatel nenalezen.'});
                let valid = user.comparePassword(password, user.password);
                if (valid) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: 'Zadali jste špatné heslo.'});
                }
            })
            .catch(err => {
                return done(err);
            })
    }))
}