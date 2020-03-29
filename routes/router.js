var express = require('express');
var router = express.Router();
var User = require('./user');
var Ticket = require('./ticket');

// GET route for reading data
router.get('/', User.login);
router.post('/', User.authentication, User.create);

router.get('/profile', User.loginRequired);

router.get('/logout', User.logout);

router.get('/updateAll', Ticket.updateAll);
router.get('/closed_tickets', Ticket.closedTickets);
router.get('/open_tickets', Ticket.openTickets);

module.exports = router