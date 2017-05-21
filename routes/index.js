var express = require('express');
var router = express.Router();

var ctrlUnAuth = require('../controllers/unauth');
var ctrlAuth = require('../controllers/auth');

/* GET home page. */
router.get('/', ctrlUnAuth.home);

/* GET registration page. */
router.get('/register', ctrlUnAuth.register);

/* GET dog registration page. */
router.get('/register-dog', ctrlUnAuth.registerDog);

/* GET discover page */
router.get('/discover', ctrlAuth.discover);
router.post('/discover', ctrlAuth.discoverPost);

/* GET messages page */
router.get('/messages', ctrlAuth.messages);

/* GET profile page */
router.get('/profile', ctrlAuth.profile);

module.exports = router;
