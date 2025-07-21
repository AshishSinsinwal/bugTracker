const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTicketsByProject,
  updateTicketStatus,
  addComment , getTicketsByDeveloper , assignDeveloper , deleteTicket , updateTicketDetails
} = require('../controllers/ticketController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/my-tickets', verifyToken, requireRole('developer'), getTicketsByDeveloper);

// Admin: Create ticket
router.post('/create/:projectId', verifyToken, requireRole('admin'), createTicket);

// Get tickets of a project (admin + dev)
router.get('/:projectId', verifyToken, getTicketsByProject);

// Developer: Update status
router.patch('/:ticketId/status', verifyToken, requireRole('developer'), updateTicketStatus);

// Add comment (admin or dev)
router.post('/:ticketId/comment', verifyToken, addComment);
// add asigned To

router.patch('/:ticketId/assign' , verifyToken , requireRole("admin" ), assignDeveloper);

router.delete('/:ticketId' , verifyToken , requireRole('admin') , deleteTicket);



module.exports = router;
