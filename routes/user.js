var UserSchema = require('../models/user');
var path = require('path');

var User = {
    authentication: function (req, res, next) {
        if (req.body.password !== req.body.passwordConf) {
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
        } else {
            return next();
        }
    },
    create: function (req, res, next) {
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
                    User.fetchUserName(user._id, function (err, username) {
                        if (err) {
                            return next(err);
                        } else {
                            return res.render('profile.hbs', {
                                username: username
                            });
                        }
                    });
                }
            });
        } else if (req.body.logemail && req.body.logpassword) {
            UserSchema.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
                if (error || !user) {
                    var err = new Error('Wrong email or password.');
                    err.status = 401;
                    return next(err);
                } else {
                    req.session.userId = user._id;
                    User.fetchUserName(user._id, function (err, username) {
                        if (err) {
                            return next(err);
                        } else {
                            return res.render('profile.hbs', {
                                username: username
                            });
                        }
                    });
                }
            });
        } else {
            var err = new Error('All fields required.');
            err.status = 400;
            return next(err);
        }
    },
    loginRequired: function (req, res, next) {
        if (req.session && req.session.userId) {
            return next();
        } else {
            var err = new Error('Need to login to view this page');
            err.status = 401;
            return next(err);
        }
    },
    login: function (req, res, next) {
        if (req.session && req.session.userId) {
            User.fetchUserName(req.session.userId, function (err, username) {
                if (err) {
                    return next(err);
                } else {
                    return res.render('profile.hbs', {
                        username: username
                    });
                }
            });
        } else {
            return res.sendFile(path.join(__dirname + '/../static_files/index.html'));
        }
    },
    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        } else {
            return res.redirect('/');
        }
    },
    displayProfile: function (req, res, next) {
        UserSchema.findOne({
            _id: req.person_id
        }, function (err, docs) {
            if (err) {
                return next(err);
            }
            // Admin can see the ticket bought by someone in more detail
            if (req.session.userId == '5e822a9ce10b6e09ab50bee3') {
                res.send(`Ticket bought by ${docs.username}`);
            } else {
                res.send('Ticket has been bought');
            }
        });
    },
    buyTicket: function (req, res, next) {
        UserSchema.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                if (req.session.userId == user._id) {
                    return next();
                } else {
                    var err = new Error('This user does not match the previously logged in user');
                    err.status = 401;
                    return next(err);
                }
            }
        });
    },
    fetchUserName: function (userID, callback) {
        UserSchema.findOne({
            _id: userID
        }, function (err, doc) {
            if (err) {
                return callback(err);
            }
            return callback(null, doc.username);
        });
    }
}



module.exports = User;