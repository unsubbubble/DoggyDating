var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DoggyDates' });
});

/* GET registration page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'DoggyDates - Registration' });
});

/* GET dog registration page. */
router.get('/register/dog', function(req, res, next) {
  res.render('register_dog', { title: 'DoggyDates - Dog Registration' });
});

module.exports = router;
