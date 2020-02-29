var express = require('express');
var router = express.Router();
const Post = require('../models/post.model');
const Photo = require('../models/photo.model');
const Video = require('../models/video.model');
const helpers = require('./../controllers/helpers');

/* GET home page. */
router.get('/', function(req, res, next) {

  let allWebsites = [];
  let allFiles = [];
  let image = {
    _id: '',
    length: '',
    name: '',
    data: '',
    subject: '',
  }

  Post.find().then(data => {
    if (!data) throw new Error('Data not found');

      let allPosts = data;

    allWebsites = data.filter(article => {
      if(article.subject === "WEB") {
        return true;
      } else {
        return false;
      }
    }).map(website => {
      return {
        _id: website._id,
        title: website.title,
        thumbnail: website.thumbnail,
        url: website.url,
        subject: website.subject
      }
    });


    Photo.find().then(images => {

      allnonThumnailsImages = images.filter(function (img, index) {
        return !img.originalImg && index < 3;
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

      let allDrawings = images.filter(image => {
        if (image.group) {
          return true;
        }
        return false;
      })

      allMMEImages = images.filter((image, index) => {
        if(image.subject === "MME" && !image.doc_id && index < 3) {
          return true;
        } else {
          return false;
        }
      })


        let allVideos = allPosts.filter((video, index) => {
          if(index < 3) {
            return true;
          } else {
            return false;
          }
        }).map(video => {
              return {
                _id: video._id,
                title: video.title,
                thumbnail: video.thumbnail,
                url: video.url,
                subject: video.subject
              }
        })


        res.render('index', {websites: allWebsites, images: allnonThumnailsImages, videos: allVideos, mmeImages: allMMEImages, drawings: allDrawings})
    })

  })
})



router.get('/images', (req, res) => {

    let allFiles = [];
      Photo.find().then(images => {
        allFiles = images.filter(img => {
          if (img.group) {
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

        res.render('images', {images: allFiles});
    })




  })


module.exports = router;
