import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
const orderController = new OrderController();

// Protect this route
router.get('/', authenticateToken, orderController.list.bind(orderController));
router.post('/', authenticateToken, orderController.create.bind(orderController));
router.patch('/:id/status', authenticateToken, orderController.updateStatus.bind(orderController));
router.post('/:id/cancel', authenticateToken, orderController.cancel.bind(orderController));
router.patch('/:id/payment', authenticateToken, orderController.updatePayment.bind(orderController));

export default router;
