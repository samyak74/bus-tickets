var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost/bus_tickets');
var db = mongoose.connection;

var app = express();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  }));  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + 'static_files'));

var routes = require('./routes/router');
app.use('/', routes);

app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});
  
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});  

app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});