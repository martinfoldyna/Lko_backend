const Article = require('../models/post.model');
const Photo = require('./../models/photo.model');
const Video = require('./../models/video.model');
const File = require('../models/photo.model');
const helpers = require('./helpers');


module.exports.delete = (req, res, next) => {
    console.log(req.params);
    let paramModel = req.params.model;
    let paramId = req.params.id;

    let model = helpers.findModel(paramModel);

    if(model) {
        model.deleteOne({_id: paramId}).then(doc => {
            res.send(doc);
        })
    }

}

module.exports.stateCheck = (req, res, next) => {
    res.status(200).message('Server is running');
}
