const User = require('./../models/authorisedUser.model');
const messages = require('./../config/messages.helper');
const userHelper = require('./../helpers/userFind.helper');

module.exports.getAll = (req, res, next) => {
    User.find().then((users) => {
        if(users) {
            res.status(messages.USER.MULTI_LOADED.status).json({
                code: messages.USER.MULTI_LOADED,
                users: users
            })
        } else {
            res.status(messages.USER.MUTLIPLE_NOT_FOUND.status).json({
                code: messages.USER.MUTLIPLE_NOT_FOUND,
            })
        }
    }).catch(err => {
        return next(err);
    })
}

module.exports.load = (req, res, next) => {
    User.findOne({email: req.params.email}).then(user => {
        if(!user) res.status(messages.USER.ONE_NOT_FOUND.status).json({
            code: messages.USER.ONE_NOT_FOUND
        })

        res.status(messages.USER.ONE_LOADED.status).json({
            code: messages.USER.ONE_LOADED,
            user: user
        })
    })
}

module.exports.update = (req, res, next) => {
    let userId = req.params.id;
    let updatedUser = req.body;

    User.findById(userId).then(user => {
        if(!user) {
            res.status(messages.USER.ONE_NOT_FOUND.status).json({
                code: messages.USER.ONE_NOT_FOUND,
                user: null
            })
        }
        userHelper.getUserInfoByToken(req.headers.authorization).then(appUser => {
            user.role = updatedUser.role;
            if(appUser.role === "admin") {
                user.save().then((data) => {

                    res.status(messages.USER.UPDATED.status).json({
                        code: messages.USER.UPDATED,
                        user: data
                    })
                }, err => {
                    return next(err);
                })
            } else {
                res.status(messages.USER.NOT_AUTHORISED.status).json({
                    code: messages.USER.NOT_AUTHORISED,
                    user: null
                })
            }
        }).catch(err => {
            return next(err);
        })
    })
}

module.exports.remove = (req, res, next) => {
    User.deleteOne({_id: req.params.id}, {}, (err, result) => {
        if(!result) {
            res.status(messages.USER.ONE_NOT_FOUND.status).json({
                code: messages.USER.ONE_NOT_FOUND,
                result: null
            })
        }
        if(err) {
            return next(err);
        }
        res.status(messages.USER.DELETED.status).json({
            code: messages.USER.DELETED,
            result: result
        })
    })
}
