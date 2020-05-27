const router = require('express').Router();
const AuthCtrl = require('./../controllers/auth.ctrl');
const passport = require('passport');


router.post('/google/login', AuthCtrl.googleLogin);
router.post('/microsoft/login', AuthCtrl.microsoftLogin);
router.post('/authorise/:id', AuthCtrl.authorise);
router.post('/deauthorise/:id', AuthCtrl.deauthorise);

router.post('/logout', (req, res, next) => {
    req.logout();
    res.json({
        state: true
    })
})


module.exports = router;
