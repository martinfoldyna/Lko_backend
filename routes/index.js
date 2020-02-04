var express = require('express');
var router = express.Router();
const Articles = require('../models/post.model');
const File = require('../models/photo.model');
const moment = require('moment');
const helper = require('handlebars-helpers');

/* GET home page. */
router.get('/view', function(req, res, next) {

  let allArticles = [];


  Articles.find().then(data => {
    if (!data) throw new Error('Data not found');

    allArticles = data;
    console.log(allArticles);
    res.render('index', {articles: data})
  })

});

router.get('/images', (req, res) => {
  let allFiles = [];
  File.find({}).then(files => {
    if(!files) throw new Error('Files not found');
    allFiles = [];
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if(!file.doc_id) {
        allFiles.push(file.data);
      }
    }

    // allFiles = files.map(e => {
    //   if (e.data !== undefined && !e.doc_id) {
    //     return e.data
    //   }
    // })

    res.render('images', {images: allFiles})

  })
})

module.exports = router;
