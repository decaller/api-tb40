// filepath: /workspaces/api-tb40/routes/index.js
var express = require('express');
var path = require('path');
var router = express.Router();
var { handleCalculation } = require('../services/calculation');

// Serve static files from the "public" directory
router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// API calculation routes
const versions = ['v0.1', 'v0.2'];
const types = ['tb40', 'tb40anak', 'raporkarakter'];

versions.forEach(version => {
  types.forEach(type => {
    router.get(`/api/${version}/${type}/calculation`, (req, res) => {
      res.json(handleCalculation(req.params.type, req.params.version));
    });
  });
});

module.exports = router;