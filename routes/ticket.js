var TicketSchema = require('../models/ticket');

var Ticket = {
    update: function(req, res, next){

    },
    updateAll: function(req, res, next){
        // Check whether the user attempting to update all the tickets is an admin or not
        if(req.session.userId == '5e7f373e445a7c2ad8170537'){
            TicketSchema.update({},{ $set: {status: 'open', p_id: null}},{multi: true}, function(err, docs){
                if(err){
                    var err = new Error('The status of the tickets hasnt been updated. Please check the logs and try again');
                    err.status = 504;
                    return next(err);
                }
            });
            res.send('Success!');
        }
        else{
            var err = new Error('You are not authorized to update any ticket');
            err.status = 401;
            return next(err);
        }
    },
    closedTickets: function(req, res, next){
        TicketSchema.find({ status: 'closed' }, function(err, docs){
            if(err){
                return next(err);
            }      
            if(docs.length == 0){
                res.send('<h1>All tickets are still available</h1>');
            }
            else{
                tickets = [];
                docs.forEach(function(doc){
                    ticket = {};
                    ticket['ticket_name'] = doc.ticket_number;
                    tickets.push(ticket);
                });
                return res.render('closed_ticket.hbs', {
                    tickets: tickets
                });
            }
        });
    },
    openTickets: function(req, res, next){
        TicketSchema.find({ status: 'open' }, function(err, docs){
            if(err){
                return next(err);
            }
            if(docs.length == 0){
                res.send('<h1>All tickets closed now</h1>');
            }
            else{
                tickets = [];
                docs.forEach(function(doc){
                    ticket = {};
                    ticket['ticket_name'] = doc.ticket_number;
                    tickets.push(ticket);
                });
                return res.render('open_ticket.hbs', {
                    tickets: tickets
                });
            }
        });
    }
}

module.exports = Ticket;