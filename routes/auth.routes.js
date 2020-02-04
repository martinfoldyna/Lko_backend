const router = require('express').Router();
const AuthCtrl = require('./../controllers/auth.ctrl');
const passport = require('passport');


router.post('/register', AuthCtrl.register);
router.post('/login', passport.authenticate('local'), AuthCtrl.login);
router.post('/google/login', AuthCtrl.googleLogin);
router.post('/logout', (req, res, next) => {
    req.logout();
    res.json({
        state: true
    })
})

router.get('/', (req, res, next) => {
    console.log(req.user)
    res.json({
        justPlainUser: req.user
    })
})

module.exports = router;