const jwt = require('jsonwebtoken');
const verifier = require('google-id-token-verifier');
const AuthorisedUser = require('./../models/authorisedUser.model');
const messages = require('./../config/messages.helper');
const azureJWT = require('azure-jwt-verify');
const jwtDecoder = require('jwt-decode')


require('dotenv').config();

module.exports.googleLogin = function(req, res, next) {
    let idToken = req.body.idToken;

    let clientID = process.env.TOKEN_STRATEGY_GOOGLE;

    verifier.verify(idToken, clientID, function (err, tokenInfo) {
        if (!err) {
            let splittedName = tokenInfo.email.split('@');
            if(splittedName[1] === "pslib.cz") {
                AuthorisedUser.find().then(users=> {
                    if(users.length === 0) {
                        let responseBody = {
                            name: tokenInfo.name,
                            picture: tokenInfo.picture,
                            email: tokenInfo.email,
                            state: 'authorised',
                            role: 'admin',
                            token: idToken
                        }
                        req.app.set('user', responseBody);
                        res.status(messages.AUTH.LOGIN.SUCCESS.status).json({
                            code: messages.AUTH.LOGIN.SUCCESS,
                            user: responseBody
                        })
                    } else {
                        AuthorisedUser.findOne({email: tokenInfo.email}).then(user => {
                            if(user && user.state === 'authorised') {
                                // use tokenInfo in here.
                                let responseBody = {
                                    name: tokenInfo.name,
                                    picture: tokenInfo.picture,
                                    email: tokenInfo.email,
                                    role: user.role,
                                    token: idToken
                                }
                                req.app.set('user', responseBody);
                                res.status(messages.AUTH.LOGIN.SUCCESS.status).json({
                                    code: messages.AUTH.LOGIN.SUCCESS,
                                    user: responseBody
                                })
                            } else if(user && user.state === "unauthorised") {
                                res.status(messages.AUTH.WAIT_FOR_VERIFICATION.status).json({
                                    code: messages.AUTH.WAIT_FOR_VERIFICATION,
                                    user: null
                                })
                            } else {
                                // res.send('User not authorised');
                                let newUser = new AuthorisedUser({
                                    email: tokenInfo.email,
                                    name: tokenInfo.name,
                                    state: 'unauthorised',
                                    role: 'Teacher'
                                })
                                newUser.save((err, doc) => {
                                    if(err) {
                                        return next(err);
                                    }
                                    res.status(messages.AUTH.WAIT_FOR_VERIFICATION.status).json({
                                        code: messages.AUTH.WAIT_FOR_VERIFICATION,
                                        user: null
                                    })
                                })
                            }
                        })
                    }
                })

            } else {
                res.status(messages.AUTH.USE_ANOTHER_USER.status).json({
                    code: messages.AUTH.USE_ANOTHER_USER,
                    user: null
                })
            }

        } else {
            return next(err);
        }
    });
};

module.exports.microsoftLogin = (req, res, next) => {
    let accessToken = req.body.token;
    let microsoftAud = process.env.TOKEN_STRATEGY_MICROSOFT_AUD;
    let microsoftIss = process.env.TOKEN_STRATEGY_MICROSOFT_ISS;
    let microsoftUri = process.env.TOKEN_STRATEGY_MICROSOFT_URI;
    let decodedToken = jwtDecoder(accessToken);
    console.log(decodedToken);

    azureJWT.verify(accessToken, {JWK_URI: microsoftUri, ISS: microsoftIss,AUD: microsoftAud}).then(tokenResponse => {
        let tokenInfo = JSON.parse(tokenResponse).message;
        let email = tokenInfo.preferred_username.toLowerCase();
        let splittedName = email.split('@');
        if(splittedName[1]==="365.pslib.cz" || splittedName[1]==="pslib.cloud") {
            AuthorisedUser.find().then(users=> {
                if(users.length === 0) {
                    new AuthorisedUser({
                        email: email,
                        name: tokenInfo.name,
                        state: 'authorised',
                        role: 'admin',
                        token: accessToken
                    }).save((err, doc) => {
                        if(err) {
                            return next(err);
                        }
                        req.app.set('user', doc);
                        res.status(messages.AUTH.LOGIN.SUCCESS.status).json({
                            code: messages.AUTH.LOGIN.SUCCESS,
                            user: doc
                        })
                    })
                } else {
                    AuthorisedUser.findOne({email: email, state: 'authorised'}).then(user => {
                        if(!user) {
                            // res.send('User not authorised');
                            new AuthorisedUser({
                                email: email,
                                name: tokenInfo.name,
                                state: 'unauthorised',
                                role: 'teacher',
                                token: accessToken
                            }).save((err, doc) => {
                                if(err) {
                                    return next(err);
                                }
                                res.status(messages.AUTH.WAIT_FOR_VERIFICATION.status).json({
                                    code: messages.AUTH.WAIT_FOR_VERIFICATION,
                                    user: null
                                })
                            })

                        } else if(user && user.state === "unauthorised") {
                            res.status(messages.AUTH.WAIT_FOR_VERIFICATION.status).json({
                                code: messages.AUTH.WAIT_FOR_VERIFICATION,
                                user: null
                            })
                        } else {
                            // use tokenInfo in here.
                            let responseBody = {
                                name: tokenInfo.name,
                                email: email,
                                role: user.role
                            }
                            req.app.set('user', responseBody);
                            res.status(messages.AUTH.LOGIN.SUCCESS.status).json({
                                code: messages.AUTH.LOGIN.SUCCESS,
                                user: responseBody
                            })

                        }
                    }, err => {
                        return next(err);
                    })
                }
            })
        } else {
            res.status(messages.AUTH.USE_ANOTHER_USER.status).json({
                code: messages.AUTH.USE_ANOTHER_USER,
                user: null
            })
        }

    }).catch(err => {
        return next(err);
    });


}

module.exports.authorise = (req, res, next) => {
    let userId = req.params.id;
    let user = req.app.get('user');
    if(user.role.toLowerCase() === "teacher") {
        AuthorisedUser.findOne({_id: userId, state: 'unauthorised'}).then(user => {
            user.state = 'authorised';
            user.save((err, data) => {
                if(err) {
                    return next(err);
                }

                res.status(messages.USER.AUTHORISED.status).send({
                    code: messages.USER.AUTHORISED,
                    user: data
                })
            })
        }).catch(err => {
            return next(err);
        })
    } else {
        res.status(messages.USER.NOT_AUTHORISED.status).send({
            code: messages.USER.NOT_AUTHORISED,
            user: null
        })
    }
}

module.exports.deauthorise = (req, res, next) => {
    let userId = req.params.id;
    let user = req.app.get('user');
    if(user.role.toLowerCase() === "teacher") {
        AuthorisedUser.findOne({_id: userId, state: 'authorised'}).then(user => {
            user.state = 'unauthorised';
            user.save((err, data) => {
                if(err) {
                    return next(err);
                }

                res.status(messages.USER.DEAUTHORISED.status).send({
                    code: messages.USER.DEAUTHORISED,
                    user: data
                })
            })
        }).catch(err => {
            return next(err);
        })
    } else {
        res.status(messages.USER.NOT_AUTHORISED.status).send({
            code: messages.USER.NOT_AUTHORISED,
            user: null
        })
    }
}

module.exports.delete = (req, res, next) => {
    AuthorisedUser.deleteOne({_id: req.params.id}, {}, (err, results) => {
        if(err) {
            return next(err);
        }

        res.status(messages.USER.DELETED.status).send({
            code: messages.USER.DELETED,
            result: results
        })
    })

}
