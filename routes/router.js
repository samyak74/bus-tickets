var express = require('express');
var router = express.Router();
var User = require('./user');


// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});

router.post('/', User.authentication, User.create);