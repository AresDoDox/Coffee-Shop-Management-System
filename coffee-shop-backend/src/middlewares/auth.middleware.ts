/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import errors from '../constants/errors.json' with { type: "json" };

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: errors.AUTH.NO_TOKEN });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: errors.AUTH.INVALID_TOKEN });
      return;
    }
    
    // Attach user to request
    req.user = user;
    next();
  });
};
