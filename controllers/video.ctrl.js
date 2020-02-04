const Video = require('./../models/video.model');

module.exports.uploadVideo = (req, res, next) => {
    let reqBody = req.body;

    let newVideo = new Video({
        title: reqBody.title,
        url: reqBody.url,
        description: reqBody.description,
        createdBy: req.app.get('user'),
        createdAt: Date.now(),
        subject: reqBody.subject
    })

    newVideo.save((err, doc) => {
        if(err) {
            console.log(err);
            throw err;
        }

        res.status(200).send(doc);
    })
}

module.exports.retrieveVideos = (req, res, next) => {
    let subject = req.params.subject;
    let findVideos = subject === "all" ?  Video.find({}) : Video.find({subject: subject});

    findVideos.then(data => {
        res.send(data);
    }, err => {
        return next(err);
    })
}

module.exports.delete = (req, res, next) => {
    Video.deleteOne({_id: req.params.id}, {}, (err, results) => {
        if(err) return next(err);
        res.send(results.result)
    }).catch(err => {
        return next(err);
    })
}