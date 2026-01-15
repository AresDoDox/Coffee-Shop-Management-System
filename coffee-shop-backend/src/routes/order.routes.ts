import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
const orderController = new OrderController();

// Protect this route
router.post('/', authenticateToken, orderController.create.bind(orderController));

export default router;
