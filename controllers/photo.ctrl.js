const mongoose = require('mongoose');
const fs = require('fs');
const fileType = require('file-type');
const Photo = require('../models/photo.model');

let Grid = require('gridfs-stream');
eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);
let conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

    module.exports.uploadPhotos = (req, res, next) => {

        let fileKeys = Object.keys(req.files);
        let files = [];
        let subject = req.body.subject;
        let docId = req.body.docId;

        fileKeys.forEach((key) => {
            files.push(req.files[key]);
        });



        files.forEach(file => {
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
                orientation: file.orientation
            })

            console.log(req.app.get('user'));
            if(req.app.get('user')) {
                newFile.createdBy = req.app.get('user');
                newFile.createdAt = Date.now();
            }


            if(subject) {
                newFile.subject = subject;
            }

            if(docId) {
                newFile.doc_id = docId;
            }

            newFile.save((err) => {
                if(err) next(err);
            });
        })

        console.log(fileKeys);
        console.log(files);

        res.send('all files have been uploaded');


        res.end();
    }

    module.exports.retrievePhotos = (req, res, next) => {
        let subject = req.params.subject

        let findImages = subject === "all" ?  Photo.find({}) : Photo.find({subject: subject});

        findImages.then(docs => {
                if(!docs) res.send('files not found');

                let responseBody = [];

                docs.forEach(image => {
                    if(!image.doc_id){
                        responseBody.push({
                            _id: image._id,
                            filename: image.name,
                            base64: image.data.toString('base64'),
                            orientation: image.orientation,
                            createdAt: image.createdAt,
                            createdBy: image.createdBy,
                        });
                    }
                })
                res.json(responseBody);
            })
    }

    module.exports.retrievePhotoForDocument = (req, res, next) => {
        let docId = req.params.id;

        Photo.findOne({doc_id: docId}).then(file => {
            if(!file) return next(new Error('file not found'));

            res.send(file);
        })
    }

    module.exports.delete = (req, res, next) => {
        let imageId = req.params.id;

        Photo.deleteOne({_id: imageId}, {}, (err, result) => {
            if(err) return next(err);
            res.send(result);
        })
    }
