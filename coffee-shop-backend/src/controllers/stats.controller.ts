import type { Request, Response } from 'express';
import { StatsService } from '../services/stats.service.js';

import errors from '../constants/errors.json' with { type: "json" };

const statsService = new StatsService();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      code: 'FETCH_FAILED',
      message: errors.STATS.FETCH_FAILED
    });
  }
};
