var express = require('express');
var path = require('path');
var router = express.Router();

// Serve static files from the "public" directory
router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
