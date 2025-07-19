const Ticket = require('../models/ticket.model');
const mongoose = require('mongoose');

exports.createTicket = async (req, res) => {
    try {
        const { name, email, phone, country, description, consent } = req.body;

        const ticket = new Ticket({
            name,
            email,
            phone,
            country,
            description,
            consent
        });

        await ticket.save();
        res.status(201).json({ message: 'Ticket created successfully', ticket });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create ticket', error: err.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const { email, status } = req.query;
        const filter = {};
        if (email) filter.email = email;
        if (status) filter.status = status;

        const tickets = await Ticket.find(filter);
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('user_id');
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        res.status(200).json(ticket);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch ticket', error: err.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ticket ID' });
        }

        const updated = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: 'Ticket not found' });

        res.status(200).json({ message: 'Ticket updated successfully', ticket: updated });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update ticket', error: err.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const deleted = await Ticket.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Ticket not found' });

        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete ticket', error: err.message });
    }
};

exports.addReply = async (req, res) => {
    try {
        const { sender, message } = req.body;

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.replies.push({ sender, message });
        await ticket.save();

        res.status(200).json({ message: 'Reply added successfully', ticket });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add reply', error: err.message });
    }
};