import type { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';

const orderService = new OrderService();

export class OrderController {
  
  // POST /orders
  async create(req: Request, res: Response) {
    try {
      const { userId, items } = req.body;

      // Basic Validation
      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Invalid input. userId and items (array) are required.' });
        return;
      }

      const order = await orderService.createOrder(userId, items);
      res.status(201).json(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }
}
