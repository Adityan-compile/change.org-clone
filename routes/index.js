var express = require('express');
var userHelpers = require('../helpers/userHelpers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LIFE' });
});

module.exports = router;
