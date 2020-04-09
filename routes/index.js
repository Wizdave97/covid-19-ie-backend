var express = require('express');
const index = require('../controllers/')
var router = express.Router();

/* GET home page. */
router.post('/', index.jsonController);
router.post('/json', index.jsonController);
router.post('/xml', index.xmlController);

module.exports = router;
