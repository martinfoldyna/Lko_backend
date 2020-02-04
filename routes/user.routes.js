const express = require('express');
const router = express.Router();
const passport = require('passport');

const userCtrl = require('./../controllers/user.ctrl');


/* ::GET:: users listing. */
router.get('/', function(req, res, next) {
    console.log(req.user);
  res.json({
      requestUser: req.user,
      message: 'Hello Bitches'

  });

});

router.post('/update/:id', userCtrl.update)

module.exports = router;
