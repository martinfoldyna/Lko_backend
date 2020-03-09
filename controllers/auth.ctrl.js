const jwt = require('jsonwebtoken');
const verifier = require('google-id-token-verifier');
const AuthorisedUser = require('./../models/authorisedUser.model');
const messages = require('./../config/messages.helper')

require('dotenv').config();

module.exports.googleLogin = function(req, res, next) {
    let idToken = req.body.idToken;

    let clientID = '63183198040-t7kq60occjo8uqpc60bmasg6g0s2r42p.apps.googleusercontent.com';

    verifier.verify(idToken, clientID, function (err, tokenInfo) {
        if (!err) {
            let splittedName = tokenInfo.email.split('@');
            if(splittedName[1] === "pslib.cz" || splittedName[1] === "pslib.cloud" || splittedName[1] === "365.pslib.cz") {
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
                        console.log(tokenInfo);
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
            } else {
                res.status(messages.AUTH.USE_ANOTHER_USER.status).json({
                    code: messages.AUTH.USE_ANOTHER_USER,
                    user: null
                })
            }

        } else {
            res.send('OOpss');
        }
    });
};

module.exports.microsoftLogin = (req, res, next) => {
    let accessToken = req.body.token;
    let key = "-----BEGIN CERTIFICATE-----\nMIIDBTCCAe2gAwIBAgIQGb5LYbKo3IdM0HQsjv+mEjANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTE5MTIyNjAwMDAwMFoXDTI0MTIyNTAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL6v90zkm61M6RjxxRMI5nqBP2bt/sFOL2nhL40M1B18CHn8vGw7jGr+js1IhF4Yy1+SUZBoXbN5TRkdwkmYGq7SClr+Va3OxdmHAXIM66TtOpFXHsETI3Yaz2H1HzukJJQDkgnD6uEVIRL5BhMGwMN2sHJb3tSroaV+nziCJz/BqfIaxQ3f53gUdwGNNya2aXswXUKBNuFB4AJRxm9lGdiio5d6ywzD4fR3nI04oGt0m3XK4UwDmB2G+C8Akq04ax0smRQcc08EDEtDRMile//gA6xbp3/XLlXBqUGZL3cDg5eLWPpdrHd1qaA/4DA6aBSVaI48xdO6L6357TOKPAcCAwEAAaMhMB8wHQYDVR0OBBYEFMGZU4IfHXk8nigJzTMM45KzMjeVMA0GCSqGSIb3DQEBCwUAA4IBAQAMJF5kk0gj119v4wbQTr9sQr9SS7ALfmIBQaeWjWRZvmXbEnMMA46y9nShV+d3cFrIrxuz7ynd3PU0+2HP4217VHO3rFyNbNnp4IB+BJa+hW/Hi54X+m/QPztDFCdiP1zYWr7DNEvnebuAMAJ+W0I08h5yIcX6Z0TTZcrWc72Qyi2Y2MuYDN+AVvQ1WZWsU4gbnUK7oj8bYnLfzWWuhfks2vC5Sbx9+79j+36HtsQnYe9ouxQ5vfNxm7wcLTQQulU16lnD0yObvr1hfteKfuW2/Ynoy5Z2ntIyCbGxiulaPLrFTW4gUhYgnteB5CwGw1C5vhv0Aa+XZouHVhoOLhWF\n-----END CERTIFICATE-----"
    jwt.verify(accessToken, key, {}, (err, tokenInfo) => {
        let email = tokenInfo.preferred_username.toLowerCase();
        let splittedName = email.split('@');
        console.log(splittedName);
        if(splittedName[1]==="365.pslib.cz") {
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
        } else {
            res.status(messages.AUTH.USE_ANOTHER_USER.status).json({
                code: messages.AUTH.USE_ANOTHER_USER,
                user: null
            })
        }

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
            result: result
        })
    })

}
