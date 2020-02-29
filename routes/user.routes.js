const express = require('express');
const router = express.Router();
const passport = require('passport');

const userCtrl = require('./../controllers/user.ctrl');


/* ::GET:: users listing. */
router.get('/', function(req, res, next) {
    console.log(req.user);


});

router.get('/getAll', userCtrl.getAll);

router.post('/remove/:id', userCtrl.remove);

module.exports = router;
