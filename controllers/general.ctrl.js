const Article = require('../models/post.model');
const Photo = require('./../models/photo.model');
const Video = require('./../models/video.model');
const File = require('../models/photo.model');


module.exports.delete = (req, res, next) => {
    console.log(req.params);
    let paramModel = req.params.model;
    let paramId = req.params.id;
    let model;

    switch (paramModel) {
        case 'video':
            model = Video;
            break;
        case 'photo':
            model = Photo;
            break;
        case 'article':
            model = Article;
            break;
        case 'file':
            model = File;
            break;
    }

    if(model) {
        model.deleteOne({_id: paramId}).then(doc => {
            res.send(doc);
        })
    }

}

module.exports.stateCheck = (req, res, next) => {
    res.status(200).message('Server is running');
}