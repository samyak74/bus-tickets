var express = require('express');
var router = express.Router();
var User = require('./user');

// GET route for reading data
router.get('/', User.login);
router.post('/', User.authentication, User.create);

router.get('/profile', User.loginRequired);

module.exports = router