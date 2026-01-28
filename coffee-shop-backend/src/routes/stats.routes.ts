import express from 'express';
import { getDashboardStats } from '../controllers/stats.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, getDashboardStats);

export default router;
