var express = require('express');
var router = express.Router();
const logs = require("../controllers/logs");

/* GET users listing. */
router.get('/', logs.logsController);

module.exports = router;
