import type { Request, Response } from 'express';
import { StatsService } from '../services/stats.service.js';

const statsService = new StatsService();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
