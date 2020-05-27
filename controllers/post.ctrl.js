const Post = require('../models/post.model');
const messages = require('./../config/messages.helper')

module.exports.add = (req, res, next) => {
    if(!req.body) {
        return next()
    }

    const requestBody = req.body;
    const thumbnail = req.files.thumbnail;
    let subject = req.params.subject;
    let user;
    if(req.app.get('user')) {
        user = req.app.get('user')
    } else {
        user = {name: "Unknown"}
    }

    let newArticle = new Post({
        title: requestBody.title,
        createdAt: Date.now(),
        createdBy: user,
        thumbnail: thumbnail.data.toString('base64'),
        subject: req.params.subject,
        classYear: requestBody.classYear,
    })

    if(requestBody.url) {
        newArticle.url = requestBody.url;
    }

    if(requestBody.body) {
        newArticle.body = requestBody.body;
    }

    newArticle.save((err, doc) => {
        if(err) {
            throw err;
        }

        res.status(messages.POST.UPLOADED.status).json({
            code: messages.POST.UPLOADED,
            post: doc
        })
    })

}

module.exports.load = (req, res, next) => {
    let subject = req.params.subject;
    let findArticle = subject === "all" ?  Post.find({}) : Post.find({subject: subject});
    findArticle.then(data => {
        if(!data) {
            res.status(messages.POST.NOT_FOUND.status).json({
                code: messages.POST.NOT_FOUND,
                post: null
            })
        }
            res.status(messages.POST.ALL_LOADED.status).json({
                code: messages.POST.ALL_LOADED,
                post: data
            })
        }).catch(err => {
            return next(err);
    })
}

module.exports.update = (req, res, next) => {
    let articleId = req.params.id;
    let requestBody = req.body;
    Post.findById(articleId).then(data => {
        if(!data) {
            res.status(messages.POST.NOT_FOUND.status).json({
                code: messages.POST.NOT_FOUND,
                post: null
            })
        }
        let appUser = req.app.get('user');
        data.title = requestBody.title;
        data.body = requestBody.body;
        if(appUser) {
            data.updatedBy = appUser;
        }
        data.updatedAt = Date.now();
        data.save().then((data) => {

            res.status(messages.POST.UPDATED.status).json({
                code: messages.POST.UPDATED,
                post: data
            })
        }, err => {
            return next(err);
        })
    }).catch(err => {
        return next(err);
    })
}

