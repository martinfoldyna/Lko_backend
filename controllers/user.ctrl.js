const User = require('./../models/user.model');

module.exports.update = (req, res, next) => {
    console.log(req.user);
    User.findOneAndUpdate({_id: req.params.id}, {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username
    }, {new: true}, (err, doc) => {
            if(err) return res.status(400).send('Uživatel nenalezen!');

            res.status(200).json({
                data: doc,
                toaster: {
                    message: 'Vaše uživatelské informace byly změněny.',
                    title: 'Jupí!',
                    status: "success"
                }
        })

        })
}