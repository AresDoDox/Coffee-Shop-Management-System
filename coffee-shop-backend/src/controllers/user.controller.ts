import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import errors from '../constants/errors.json' with { type: "json" };

const userService = new UserService();

export class UserController {
  
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: errors.USER.MISSING_FIELDS });
        return;
      }
      
      const user = await userService.register(email, password, name);
      res.status(201).json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(400).json({ error: message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: errors.USER.MISSING_FIELDS });
        return;
      }

      const result = await userService.login(email, password);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(401).json({ error: message });
    }
  }
}
