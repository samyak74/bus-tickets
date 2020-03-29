var express = require('express');
var router = express.Router();
var User = require('./user');
var Ticket = require('./ticket');
var path = require('path');

// GET route for reading data
router.get('/', User.login);
router.post('/', User.authentication, User.create);

router.get('/profile', User.loginRequired, User.login);

router.get('/logout', User.logout);

router.get('/updateAll', Ticket.updateAll);
router.get('/closed_tickets', Ticket.closedTickets);
router.get('/open_tickets', Ticket.openTickets);

router.get('/ticket_status/:ticket_number', User.loginRequired, Ticket.ticketStatus, User.displayProfile);
router.get('/buy_ticket', User.loginRequired, function(req, res, next){
    return res.sendFile(path.join(__dirname + '/../static_files/buy_ticket.html'));
});
router.post('/buy_ticket', User.loginRequired, User.buyTicket, Ticket.ticketStatus, Ticket.bookingTicket);

module.exports = router