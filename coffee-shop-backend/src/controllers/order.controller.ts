/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import errors from '../constants/errors.json' with { type: "json" };

const orderService = new OrderService();

export class OrderController {
  
  // GET /orders
  async list(req: Request, res: Response) {
      try {
          const orders = await orderService.getRecentOrders();
          res.json(orders);
      } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          res.status(500).json({ message });
      }
  }

  // POST /orders
  async create(req: Request, res: Response) {
    try {
      // User ID comes from the token, not the body (Secure)
      const userId = (req.user as any)?.id; 
      const { items, paymentMethod } = req.body;

      // Basic Validation
      // Note: userId is guaranteed by middleware if using strict typing, but good to check.
      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({
          code: 'INVALID_INPUT',
          message: errors.ORDER.INVALID_INPUT
        });
        return;
      }

      const order = await orderService.createOrder(userId, items, paymentMethod);
      res.status(201).json(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      // Basic approach: If Prisma fails (e.g., Foreign Key constraint), it throws an error.
      // In a real app, we would parse the Prisma error code (e.g., P2003) for a better message.
      res.status(400).json({
        code: 'CREATE_FAILED',
        message: message === errors.Common.UNKNOWN_ERROR ? errors.ORDER.CREATE_FAILED : message
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ message: 'Status is required' });
        return;
      }

      const order = await orderService.updateStatus(Number(id), status);
      res.json(order);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const order = await orderService.cancelOrder(Number(id));
        res.json(order);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ message });
    }
  }

  async updatePayment(req: Request, res: Response) {
      try {
          const { id } = req.params;
          const { paymentMethod, paymentStatus } = req.body;
          const order = await orderService.updatePaymentStatus(Number(id), paymentMethod, paymentStatus);
          res.json(order);
      } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          res.status(400).json({ message });
      }
  }
}
