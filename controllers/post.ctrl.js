const Post = require('../models/post.model');

module.exports.add = (req, res, next) => {
    if(!req.body) {
        return next()
    }

    const requestBody = req.body;
    let user = undefined
    if(req.app.get('user')) {
        user = req.app.get('user')
    } else {
        user = {name: "Unknown"}
    }

    let newArticle = new Post({
        title: requestBody.title,
        createdAt: Date.now(),
        createdBy: user
    })

    if(requestBody.url) {
        newArticle.url = requestBody.url;
    }

    if(requestBody.body) {
        newArticle.body = requestBody.body;
    }

    if(requestBody.subject) {
        newArticle.subject = requestBody.subject;
    }

    newArticle.save((err, doc) => {
        if(err) {
            console.log(err);
            throw err;
        }

        res.status(200).send(doc);
    })

}

module.exports.load = (req, res, next) => {
    let subject = req.params.subject;
    let finArticle = subject === "all" ?  Post.find({}) : Post.find({subject: subject});
    finArticle.then(data => {
            res.send(data);
        }).catch(err => {
            return next(err);
    })
}

module.exports.update = (req, res, next) => {
    let articleId = req.params.id;
    let requestBody = req.body;
    Post.findById(articleId).then(data => {
        let appUser = req.app.get('user');
        data.title = requestBody.title;
        data.body = requestBody.body;
        if(appUser) {
            data.updatedBy = appUser;
        }
        data.updatedAt = Date.now();
        console.log(Date.now());
        data.save().then((data) => {


            res.status(200).json({
                message: 'Post updated',
                article: data
            })
        }, err => {
            return next(err);
        })
    }).catch(err => {
        return next(err);
    })
}

module.exports.delete = (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}, {}, (err, results) => {
        if(err) return next(err);
        res.send(results.result)
    }).catch(err => {
        return next(err);
    })


}