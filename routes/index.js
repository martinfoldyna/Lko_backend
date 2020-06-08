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

  function sortByDate(a, b) {
    return (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0)
  }

  Post.find().then(data => {
    if (!data) throw new Error('Data not found');
      data = data.sort(sortByDate)

      let allPosts = data;


    allWebsites = data.filter((article, index) => {
      if(article.subject === "WEB") {
        return true;
      } else {
        return false;
      }
    }).filter((article,index) => {
      return index < 3;
    }).map(website => {
      return {
        _id: website._id,
        title: website.title,
        thumbnail: website.thumbnail,
        url: website.url,
        subject: website.subject,
        classYear: website.classYear+1
      }
    });


    Photo.find().then(images => {
      images = images.sort(sortByDate)

      allnonThumnailsImages = images.filter(function (img, index) {
        return img.subject ==="MME" && img.thumbnail && !img.group;
      }).filter((image,index) => {
        return index < 3;
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


        let allVideos = allPosts.filter((video, index) => {
          if(video.subject === "MME") {
            return true;
          } else {
            return false;
          }
        }).filter((image,index) => {
          return index < 3;
        }).map(video => {
              return {
                _id: video._id,
                title: video.title,
                thumbnail: video.thumbnail,
                url: video.url,
                subject: video.subject,
                classYear: video.classYear+1
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
          allDrawings.sort(sortByDate).filter((article,index) => {
            return index < 3;
          });

        }
        res.render('index', {websites: allWebsites, images: allnonThumnailsImages, videos: allVideos, drawings: allDrawings})


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

          if(!file.name.includes('.jpg')) {
            file.name = file.name.replace(/_/g, ' ');
          }

        if (file.data !== undefined && !file.doc_id) {
          let image = {
            _id: file._id,
            length: file.length,
            name: file.name,
            data: file.data,
            subject: file.subject,
            classYear: file.classYear+1,
            tag: 'foto'
          }
          return image
        } else {
          return ''
        }
      })

        let allClassYears = [...new Set(allFiles.map(item => item.classYear))].sort();

        Post.find({subject: "MME"}).then(data => {



          let allVideos = data.map(video => {
            return {
              _id: video._id,
              title: video.title,
              thumbnail: video.thumbnail,
              url: video.url,
              subject: video.subject,
              classYear: video.classYear+1,
              tag: 'video'
            }
          });

          let allVideoClassYears = [...new Set(allVideos.map(item => item.classYear))].sort();

          res.render('images', {images: allFiles, imageClassYears: allClassYears, videos: allVideos, videoClassYears: allVideoClassYears});
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
        subject: website.subject,
        classYear: website.classYear+1
      }
    });

    let allClassYears = [...new Set(allWebsites.map(item => item.classYear))].sort();

    res.render('websites', {websites: allWebsites, classYears: allClassYears});
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
