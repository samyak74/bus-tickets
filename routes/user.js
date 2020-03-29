var UserSchema = require('../models/user');
var path = require('path');

var User = {
    authentication: function(req, res, next){
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            res.send("passwords dont match");
            return next(err);
          }
          return next();
    },
    create: function(req, res, next){
        if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
            var userData = {
              email: req.body.email,
              username: req.body.username,
              password: req.body.password,
            }
            UserSchema.create(userData, function (error, user) {
                if (error) {
                  return next(error);
                } else {
                  req.session.userId = user._id;
                  return res.render('profile.hbs',{
                    userID: req.session.userId
                    });
                }
            });          
        }
        else if (req.body.logemail && req.body.logpassword) {
            UserSchema.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                if (error || !user) {
                  var err = new Error('Wrong email or password.');
                  err.status = 401;
                  return next(err);
                } else {
                  req.session.userId = user._id;
                  return res.render('profile.hbs',{
                    userID: req.session.userId
                    });
                }
            });
        }
        else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    },
    loginRequired: function(req, res, next){
        if(req.session && req.session.userId){
            return next();
        }
        else{
            var err = new Error('Need to login to view this page');
            err.status = 401;
            return next(err);
        }
    },
    login: function(req, res, next){
        if(req.session && req.session.userId){
            return res.render('profile.hbs',{
                userID: req.session.userId
            });
        }
        else{
            return res.sendFile(path.join(__dirname + '/../static_files/index.html'));
        }
    },
    logout: function(req, res, next){
        if (req.session) {
            req.session.destroy(function(err) {
              if(err) {
                return next(err);
              } else {
                return res.redirect('/');
              }
            });
        }
        else{
            return res.redirect('/');
        }
    },
    displayProfile: function(req, res, next){
        UserSchema.findOne({ _id: req.person_id }, function(err, docs){
            if(err){
                return next(err);
            }
            console.log(docs)
            // Admin can see the ticket bought by someone in more detail
            if(req.session.userId == '5e7f373e445a7c2ad8170537'){
                res.send(`Ticket bought by ${docs.username}`);
            }
            else{
                res.send('Ticket has been bought');
            }
        });
    },
    buyTicket: function(req, res, next){
        UserSchema.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
              var err = new Error('Wrong email or password.');
              err.status = 401;
              return next(err);
            } else {
              req.session.userId = user._id;
              return next();
            }
        });
    }
}

module.exports = User;