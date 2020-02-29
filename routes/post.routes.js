const router = require('express').Router();
const PostsCtrl = require('../controllers/post.ctrl');

router.post('/add/:subject', PostsCtrl.add);
router.post('/update/:id', PostsCtrl.update)
router.get('/load/:subject', PostsCtrl.load);
router.post('/delete/:id', PostsCtrl.delete)

module.exports = router;
