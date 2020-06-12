const Post = require('../models/post.model');
const messages = require('./../config/messages.helper');
const userHelper = require('./../helpers/userFind.helper');

module.exports.add = async (req, res, next) => {
    if (!req.body) {
        return next()
    }

    const requestBody = req.body;
    const thumbnail = req.files.thumbnail;
    let subject = req.params.subject;


    let newArticle = new Post({
        title: requestBody.title,
        createdAt: Date.now(),
        thumbnail: thumbnail.data.toString('base64'),
        subject: req.params.subject,
        classYear: requestBody.classYear,
    })

    await userHelper.getUserInfoByToken(req.headers.authorization).then(tokenUser => {
        newArticle.createdBy = tokenUser
    }).catch(err => {
        throw new Error(err);
    });

    if (requestBody.url) {
        newArticle.url = requestBody.url;
    }

    if (requestBody.body) {
        newArticle.body = requestBody.body;
    }

    newArticle.save((err, doc) => {
        if (err) {
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
    let userLoaded = false;
    Post.findById(articleId).then(data => {
        if(!data) {
            res.status(messages.POST.NOT_FOUND.status).json({
                code: messages.POST.NOT_FOUND,
                post: null
            })
        }

        data.title = requestBody.title;
        data.body = requestBody.body;
        userHelper.getUserInfoByToken(req.headers.authorization).then(user => {
            data.updatedBy = user;
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


    }).catch(err => {
        return next(err);
    })
}

