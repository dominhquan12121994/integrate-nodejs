let router = require('express').Router();

const msbController = require('../controllers/msb.controller');

router.get('/', msbController.index);
router.post('/', msbController.store);
router.post('/link', msbController.link);

module.exports = router;
