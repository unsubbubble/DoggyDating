var express = require('express');
var passport = require('passport');
var router = express.Router();

var ctrlUnAuth = require('../controllers/unauth');
var ctrlAuth = require('../controllers/auth');

/* GET home page. */
router.get('/', ctrlUnAuth.home);
router.post('/login', passport.authenticate('local'), ctrlUnAuth.login);

/* GET logout */
router.get('/logout', ctrlAuth.logout);

/* GET registration page. */
router.get('/register', ctrlUnAuth.register);
router.post('/register', ctrlUnAuth.registerPost);

/* GET dog registration page. */
router.get('/register-dog', ctrlUnAuth.registerDog);
router.post('/register-dog', ctrlUnAuth.registerDogPost);

/* GET discover page */
router.get('/discover', ctrlAuth.discover);
router.post('/discover', ctrlAuth.discoverPost);

/* GET messages page */
router.get('/messages', ctrlAuth.messages);

/* GET profile page */
router.get('/profile', ctrlAuth.profile);

module.exports = router;
