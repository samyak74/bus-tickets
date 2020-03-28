var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/index'));

var routes = require('./routes/router');
app.use('/', routes);

app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});