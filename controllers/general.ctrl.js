const helpers = require('./helpers');
const messages = require('./../config/messages.helper')

module.exports.delete = (req, res, next) => {
    console.log(req.params);
    let paramModel = req.params.model;
    let paramId = req.params.id;

    let model = helpers.findModel(paramModel);

    if(model) {
        model.deleteOne({_id: paramId}).then(doc => {
            res.status(messages.POST.DELETED.status).json({
                code: messages.POST.DELETED,
                result: doc
            });

            if(!doc) {
                res.status(messages.POST.NOT_FOUND.status).json({
                    code: messages.POST.NOT_FOUND
                })
            }
        })
    }

}

module.exports.stateCheck = (req, res, next) => {
    res.status(200).message('Server is running');
}
