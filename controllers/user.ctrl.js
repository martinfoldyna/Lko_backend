const User = require('./../models/authorisedUser.model');

module.exports.getAll = (req, res, next) => {
    User.find().then((users) => {
        if(users) {
            res.send(users);
        } else {
            res.send('Users not found');
        }
    }).catch(err => {
        return next(err);
    })
}

module.exports.remove = (req, res, next) => {
    User.deleteOne({_id: req.params.id}, {}, (err, result) => {
        if(err) {
            return next(err);
        }
        res.send(result);
    })
}
