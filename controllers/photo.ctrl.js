const mongoose = require('mongoose');
const Photo = require('../models/photo.model');
const messages = require('./../config/messages.helper');
const userHelper = require('./../helpers/userFind.helper');


let Grid = require('gridfs-stream');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

/*
 * Nahrávánní obrázků
 * @param req: jednotlivé obrázky
 */
module.exports.uploadPhotos = async (req, res, next) => {

        let fileKeys = Object.keys(req.files);
        let files = [];
        let subject = req.body.subject;
        let classYear = req.body.classYear;

        fileKeys.forEach((key) => {
            files.push(req.files[key]);
        });

        for (const file of files) {
            let slicedName = file.name.split(';orientation=');
            file.name = slicedName[0];
            file.orientation = parseInt(slicedName[1]);
            if(!file.orientation) {
                file.orientation = 1;
            }
            let newFile = new Photo({
                length: file.size,
                name: file.name,
                type: file.mimeType,
                data: file.data.toString('base64'),
                orientation: file.orientation,
                subject: subject,
            });

            await userHelper.findUserByToken(req.headers.authorization).then(user => {
                newFile.createdBy = user;
                newFile.createdAt = Date.now();

            })

            if(newFile.name.includes('th_')) {
                newFile.thumbnail = true;
            }


            if(classYear) {
                newFile.classYear = classYear;
            }

            if(subject === "STR") {
                newFile.group = req.body.group;
            }

            newFile.save((err) => {
                if(err) next(err);
            });
        }

    res.status(messages.PHOTO.ALL_UPLOADED.status).json({
            code: messages.PHOTO.ALL_UPLOADED,
        })

        res.end();
}

/**
 * Úprava obrázků
 * @param req: obrázek
 */
module.exports.edit = (req, res, next) => {
    let imageID = req.params.id;
    let image = req.body

    Photo.findById(imageID).then(foundImage => {
        foundImage.name = image.filename;
        foundImage.description = image.description;
        foundImage.save().then(saveData => {
            res.status(messages.PHOTO.UPDATED.status).json({
                code: messages.PHOTO.UPDATED,
                image: saveData
            })
        }).catch(err => {
            return next(err);
        })
    }).catch(err => {
        return next(err);
    })
}

/**
 * Načítání obrázků
 * @param req: předmět
 */

module.exports.retrievePhotos = (req, res, next) => {
        let subject = req.params.subject;
        let filter = req.params.filter;

        let findImages = subject === "all" ?  Photo.find({}) : Photo.find({subject: subject});

        findImages.then(docs => {
                if(!docs) res.status(messages.PHOTO.NOT_FOUND.status).send({
                    code: messages.PHOTO.NOT_FOUND,
                    photos: null
                });

                let responseBody = [];

                function  returnType(filter, image) {
                    return filter === "thumbs" && subject !== "STR" ? image.thumbnail : true;
                }

                docs.forEach(image => {
                    if(!image.doc_id && returnType(filter, image)){
                        responseBody.push({
                            _id: image._id,
                            filename: image.name,
                            base64: image.data.toString('base64'),
                            orientation: image.orientation,
                            createdAt: image.createdAt,
                            description: image.description,
                            createdBy: image.createdBy,
                            group: image.group,
                            classYear: image.classYear
                        });
                    }
                })
                res.status(messages.PHOTO.ALL_LOADED.status).json({
                    code: messages.PHOTO.ALL_LOADED,
                    photos: responseBody
                })
            }).catch(err => {
                return next(err);
        })
    }

    module.exports.retrieveGroup = (req, res, next) => {
        let group = req.params.group;

        Photo.find({group: group}).then(images => {
            responseBody = [];
            images.forEach(image => {
                if(!image) {
                    res.status(messages.PHOTO.NOT_FOUND.status).send({
                        code: messages.PHOTO.NOT_FOUND,
                        photos: null
                    })
                }

                if(!image.thumbnail) {
                    responseBody.push({
                        _id: image._id,
                        filename: image.name,
                        base64: image.data.toString('base64'),
                        orientation: image.orientation,
                        createdAt: image.createdAt,
                        createdBy: image.createdBy,
                        group: image.group,
                        classYear: image.classYear
                    });
                }
            })
            res.status(messages.PHOTO.ALL_LOADED.status).json({
                code: messages.PHOTO.ALL_LOADED,
                photos: responseBody
            })
        })
    }

    module.exports.deleteGroup = (req, res, next) => {
        let group = req.params.group;

        Photo.remove({group: group}, (err, result) => {
            if(err) return next(err);
            res.status(messages.PHOTO.ALL_DELETED.status).json({
                code: messages.PHOTO.ALL_DELETED,
                result: result
            })
        })
    }

    module.exports.delete = (req, res, next) => {
        let imageId = req.params.id;

        Photo.deleteOne({_id: imageId}, {}, (err, result) => {
            if(err) return next(err);
            res.status(messages.PHOTO.ONE_DELETED.status).json({
                code: messages.PHOTO.ONE_DELETED,
                result: result
            })
        })
    }
