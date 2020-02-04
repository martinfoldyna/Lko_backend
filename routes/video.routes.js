const router = require('express').Router();
const videoCtrl = require('../controllers/video.ctrl');

router.post('/upload', videoCtrl.uploadVideo);

router.get('/retrieve/:subject', videoCtrl.retrieveVideos);

module.exports = router