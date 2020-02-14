var express = require('express');
var router = express.Router();
const Articles = require('../models/post.model');
const Photo = require('../models/photo.model');
const Video = require('../models/video.model');
const helpers = require('./../controllers/helpers');

/* GET home page. */
router.get('/', function(req, res, next) {

  let allArticles = [];
  let allFiles = [];
  let image = {
    _id: '',
    length: '',
    name: '',
    data: '',
    subject: '',
  }

  Articles.find().then(data => {
    if (!data) throw new Error('Data not found');

    allArticles = data;
    console.log(allArticles);

    Photo.find().then(images => {
      allFiles = images.filter(function (img) {
        if (img.doc_id) {
          return false; // skip
        }
        return true;
      }).map(file => {

        if (file.data !== undefined && !file.doc_id) {
          let image = {
            _id: file._id,
            length: file.length,
            name: file.name,
            data: file.data,
            subject: file.subject,
          }
          return image
        } else {
          return ''
        }
      })

      Video.find().then(videos => {
        allVideos = videos.map(video => {
          let thumbnail;
          helpers.findModel('photo').findOne({doc_id: video._id}).then(image => {
            if (image) {
              thumbnail = image._id;
            }
          })
          if (video.data !== undefined && !video.doc_id) {
            let returnVideo = {
              _id: video._id,
              title: video.title,
              thumbnail: thumbnail,
              url: video.url,
              subject: video.subject
            }
            return returnVideo
          } else {
            return ''
          }
        })

        res.render('index', {articles: allArticles, images: allFiles, videos: allVideos})
      })
    })

  })
})
  // helpers.findModel('photo').find({}).then(files => {
  //   if(!files) throw new Error('Files not found');
  //
  //
  //
  //   allFiles = files.map(file => {
  //
  //     if (file.data !== undefined && !file.doc_id) {
  //       let image = {
  //         _id: file._id,
  //         length: file.length,
  //         name: file.name,
  //         data: file.data,
  //         subject: file.subject,
  //       }
  //       return image
  //     } else {
  //       return ''
  //     }
  //   })
  //
  //   console.log(allFiles)
  // });

  // let allVideos = []
  // helpers.findModel('video').find({}).then(videos => {
  //
  // })


router.get('/images', (req, res) => {

    let allFiles = [];
      Photo.find().then(images => {
        allFiles = images.filter(function (img) {
          console.log(img.name+' : '+img.doc_id);
          if (img.doc_id !== undefined) {
            return false; // skip
          }
          console.log('ejjj');
          return true;
        }).map(file => {

        if (file.data !== undefined && !file.doc_id) {
          let image = {
            _id: file._id,
            length: file.length,
            name: file.name,
            data: file.data,
            subject: file.subject,
          }
          return image
        } else {
          return ''
        }
      })

        res.render('images', {images: allFiles});
    })




  })


module.exports = router;
