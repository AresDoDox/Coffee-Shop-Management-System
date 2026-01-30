/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';

const paymentService = new PaymentService();

export class PaymentController {
  // GET /payment/qr/:id
  async getQR(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.id);
      const result = await paymentService.generateQRCode(orderId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        code: 'PAYMENT_QR_FAILED',
        message: error.message || 'Failed to generate QR',
      });
    }
  }

  // POST /payment/webhook
  async webhook(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({ message: 'Missing orderId' });
        return;
      }

      const result = await paymentService.processWebhook(Number(orderId));
      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        code: 'PAYMENT_WEBHOOK_FAILED',
        message: error.message || 'Webhook processing failed',
      });
    }
  }
}
