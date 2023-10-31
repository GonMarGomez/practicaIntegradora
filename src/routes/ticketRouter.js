import { Router } from 'express';
import TicketController from '../dao/controllers/ticketsController.js';

const router = Router();

const ticketController = new TicketController();

router.get('/:tid', async (req, res) => {
    const ticket = await ticketController.getTicketById(req.params.tid);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    
    res.send({ticket});
});

export default router;