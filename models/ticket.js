var mongoose = require('mongoose');

var TicketSchema = new mongoose.Schema({
    ticket_number: {
        type: Number,
        unique: false,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    p_id: {
        type: String,
        required: false,
        unique: false
    }
});

var Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;