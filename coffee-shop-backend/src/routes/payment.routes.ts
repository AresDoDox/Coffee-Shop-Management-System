import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
const paymentController = new PaymentController();

// GET /api/v1/payment/qr/:id
router.get('/qr/:id', authenticateToken, paymentController.getQR);

// POST /api/v1/payment/webhook (Public or Protected depending on real gateway, usually secured by signature)
// For simulation, we can keep it public or use a simple secret if needed. Keeping it open for now as per req.
router.post('/webhook', paymentController.webhook);

export default router;
