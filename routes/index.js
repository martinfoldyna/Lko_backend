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

    allWebsites = data.filter((article, index) => {
      if(article.subject === "WEB" && index < 3) {
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
        return img.subject ==="MME" && index > 3 && img.thumbnail && !img.group;
      }).map(file => {

        if (file.data !== undefined && !file.doc_id) {
          let image = {
            _id: file._id,
            length: file.length,
            name: file.name,
            data: file.data,
            subject: file.subject,
            classYear: file.classYear + 1
          }
          return image
        } else {
          return ''
        }
      })

      allMMEImages = images.filter((image, index) => {
        if(image.subject === "MME" && !image.doc_id && index < 3) {
          return true;
        } else {
          return false;
        }
      })


        let allVideos = allPosts.filter((video, index) => {
          if(index < 3 && video.subject === "MME") {
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
      Photo.find({subject: 'STR'}).then(drawings => {
        let allGroups = [...new Set(drawings.map(item => item.group))];
        let allImages = drawings;
        let allDrawings = [];

        for (let i = 0; i < allGroups.length; i++) {
          const thisGroup = allGroups[i];
          let galleryImages = [];
          allImages.forEach(image => {
            if (image.group === thisGroup) {
              galleryImages.push(`data:image/jpg;base64,${image.data}`);
            }
          });
          allDrawings[thisGroup] = galleryImages;
        }
        res.render('index', {websites: allWebsites, images: allnonThumnailsImages, videos: allVideos, mmeImages: allMMEImages, drawings: allDrawings})


      })
    })

  })
})

router.get('/images', (req, res) => {

    let allFiles = [];
      Photo.find().then(images => {
        allFiles = images.filter(img => {
          if (!img.group && img.thumbnail) {
            return true; // skip
          }
          return false;
        }).map(file => {


        if (file.data !== undefined && !file.doc_id) {
          let image = {
            _id: file._id,
            length: file.length,
            name: file.name,
            data: file.data,
            subject: file.subject,
            classYear: file.classYear+1
          }
          return image
        } else {
          return ''
        }
      })

        let allClassYears = [...new Set(allFiles.map(item => item.classYear))];

        Post.find({subject: "MME"}).then(data => {

          let allVideos = data.map(video => {
            return {
              _id: video._id,
              title: video.title,
              thumbnail: video.thumbnail,
              url: video.url,
              subject: video.subject
            }
          });

          // console.log(allFiles);
          res.render('images', {images: allFiles, classYears: allClassYears, videos: allVideos});
        })


    })

  })


router.get('/websites', (req, res, next) => {
  let allWebsites = [];
  Post.find({subject: 'WEB'}).then(websites => {
    allWebsites = websites.map(website => {
      return {
        _id: website._id,
        title: website.title,
        thumbnail: website.thumbnail,
        url: website.url,
        subject: website.subject
      }
    });

    res.render('websites', {websites: allWebsites});
  })
})

router.get('/drawings', (req, res, next) => {
  Photo.find({subject: 'STR'}).then(drawings => {
    let allGroups = [...new Set(drawings.map(item => item.group))];
    let allImages = drawings;
    let groupedImages = [];

    for (let i = 0; i < allGroups.length; i++) {
      const thisGroup = allGroups[i];
      let galleryImages = [];
      allImages.forEach(image => {
        if (image.group === thisGroup) {
          galleryImages.push(`data:image/jpg;base64,${image.data}`);
        }
      });
      groupedImages[thisGroup] = galleryImages;
    }
    res.render('drawings', {groups: groupedImages});
  })
})


module.exports = router;
