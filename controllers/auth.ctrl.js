const User = require('./../models/user.model');
const jwt = require('jsonwebtoken');
const verifier = require('google-id-token-verifier');

require('dotenv').config();

module.exports.register = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if(user) return res.status(400).send('User already exists!')

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            });
            newUser.save((err, doc) => {
                if (err) return next(err);

                return res.status(200).send('User created!');
            })
        })
}

module.exports.login = (req, res, next) => {
    console.log(req.headers)
    User.findOne({username: req.body.username}).exec()
        .then(user => {
            if(!user) res.status(400).send('User not found');
            let token = jwt.sign({username: user.username}, process.env.SECRET, {
                expiresIn: '30m'
            })
            req.app.set('user', user);
            res.json({
                user: req.user,
                token: token

            })
        })
        .catch(err => {
            next(err);
        })
}

module.exports.googleLogin = function(req, res, next) {
    let idToken = req.body.idToken;

    let clientID = '63183198040-t7kq60occjo8uqpc60bmasg6g0s2r42p.apps.googleusercontent.com';

    verifier.verify(idToken, clientID, function (err, tokenInfo) {
        if (!err) {
            // use tokenInfo in here.
            let responseBody = {
                name: tokenInfo.name,
                picture: tokenInfo.picture,
                email: tokenInfo.email,
                token: idToken
            }
            req.app.set('user', responseBody);
            res.send(responseBody);
            console.log(tokenInfo);
        } else {
            res.send('OOpss');
        }
    });
};
