var express = require('express');
var router = express.Router();
const config = require('config');
const CsvParser = require('../lib/csv-parser');
const PROGRAMS_LIST = './config/programs.csv';

/* GET home page. */
router.get('/', function (req, res, next) {
  const programs = CsvParser.parse();
  res.render('index', { displayName: config.displayName, programs });
});

module.exports = router;
