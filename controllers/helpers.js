const Article = require('../models/post.model');
const Photo = require('./../models/photo.model');
const Video = require('./../models/video.model');
const File = require('../models/photo.model');


module.exports.findModel = (modelName) => {
    let model;

    switch (modelName) {
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

    return model;
}

module.exports.loadAll = (modelName) => {


        return this.findModel(modelName).find({}).then(data => {
            return data;
        }).catch(err => {
            return err;
        })
}
