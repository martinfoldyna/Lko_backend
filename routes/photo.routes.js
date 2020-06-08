const router = require('express').Router();
const photoCtrl = require('../controllers/photo.ctrl');

router.post('/upload', photoCtrl.uploadPhotos);

router.post('/edit/:id', photoCtrl.edit);
router.get('/retrieve/:subject/:filter', photoCtrl.retrievePhotos);
router.get('/retrieveForGroup/:group', photoCtrl.retrieveGroup);
router.post('/deleteGroup/:group', photoCtrl.deleteGroup);
module.exports = router
