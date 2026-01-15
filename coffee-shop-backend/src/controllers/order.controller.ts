/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import errors from '../constants/errors.json' with { type: "json" };

const orderService = new OrderService();

export class OrderController {
  
  // POST /orders
  async create(req: Request, res: Response) {
    try {
      // User ID comes from the token, not the body (Secure)
      const userId = (req.user as any)?.id; 
      const { items } = req.body;

      // Basic Validation
      // Note: userId is guaranteed by middleware if using strict typing, but good to check.
      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: errors.ORDER.INVALID_INPUT });
        return;
      }

      const order = await orderService.createOrder(userId, items);
      res.status(201).json(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      // Basic approach: If Prisma fails (e.g., Foreign Key constraint), it throws an error.
      // In a real app, we would parse the Prisma error code (e.g., P2003) for a better message.
      res.status(400).json({ error: message });
    }
  }
}
