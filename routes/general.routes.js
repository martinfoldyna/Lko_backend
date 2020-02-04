const router = require('express').Router();
const GeneralCtrl = require('./../controllers/general.ctrl');

router.post('/state', GeneralCtrl.stateCheck);

router.post('/delete/:model/:id', GeneralCtrl.delete);


module.exports = router;