var express = require('express');
var bodyParser = require('body-parser');
const hbs = require('hbs');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var Ticket = require('./models/ticket');

mongoose.connect('mongodb://localhost/bus_tickets');
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {
  conn.db.listCollections().toArray(function (err, collections) {
    var flag = 0;
      for(var x = 0; x < collections.length; x+=1){
        if(collections[x]['name'] == 'tickets'){
          flag = 1;
          break;
        }
      }
      if(flag == 0){
        var tickets = [];
          for(var x = 1; x <= 40; x+=1){
            tickets.push({ticket_number: x, status: 'open', p_id: null});
          }
          Ticket.collection.insertMany(tickets, function(err, docs){
          if (err){
            return console.error(err);
          } else {
            console.log("Multiple documents inserted to Collection");
        }
      });
    }
  });
});


var app = express();

app.set('view engine', 'hbs');

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: conn
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