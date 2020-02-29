const router = require('express').Router();
const photoCtrl = require('../controllers/photo.ctrl');

router.post('/upload', photoCtrl.uploadPhotos);

router.get('/retrieve/:subject', photoCtrl.retrievePhotos);
router.post('/deleteGroup/:group', photoCtrl.deleteGroup);
module.exports = router
