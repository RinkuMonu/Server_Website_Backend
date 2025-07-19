const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/auth.middleware');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  addReply
} = require('../controllers/ticket.controller');

router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

router.post('/replies/:id', authMiddleware, isAdmin, addReply);

module.exports = router;
