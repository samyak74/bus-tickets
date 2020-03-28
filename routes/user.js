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
                  return res.redirect('/profile');
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
                  return res.redirect('/profile');
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
            return res.redirect('/profile');
        }
        else{
            var err = new Error('Need to login to view this page');
            err.status = 401;
            return next(err);
        }
    },
    login: function(req, res, next){
        if(req.session && req.session.userId){
            return res.redirect('/profile');
        }
        else{
            return res.sendFile(path.join(__dirname + '/../static_files/index.html'));
        }
    }
}

module.exports = User;