const router = require('express').Router();
const ArticlesCtrl = require('../controllers/post.ctrl');

router.post('/add', ArticlesCtrl.add);
router.post('/update/:id', ArticlesCtrl.update)
router.get('/load/:subject', ArticlesCtrl.load);

module.exports = router;