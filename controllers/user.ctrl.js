const User = require('./../models/authorisedUser.model');
const messages = require('./../config/messages.helper')

module.exports.getAll = (req, res, next) => {
    User.find().then((users) => {
        if(users) {
            res.status(messages.USER.LOADED.status).json({
                code: messages.USER.LOADED,
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
