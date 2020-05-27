const express = require('express');
const router = express.Router();

const userCtrl = require('./../controllers/user.ctrl');

router.get('/getAll', userCtrl.getAll);
router.get('/load/:email', userCtrl.load);

router.post('/update/:id', userCtrl.update);
router.post('/remove/:id', userCtrl.remove);

module.exports = router;
