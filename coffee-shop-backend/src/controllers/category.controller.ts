import type { Request, Response } from 'express';

import errors from '../constants/errors.json' with { type: "json" };
import { CategoryService } from '../services/category.service.js';

const categoryService = new CategoryService();

export class CategoryController {
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;

      const result = await categoryService.getAllCategories({ page, limit, search });
      res.json(result);
    } catch {
      res.status(500).json({
        code: 'FETCH_FAILED',
        message: errors.CATEGORY.FETCH_FAILED
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name) {
         res.status(400).json({
           code: 'NAME_REQUIRED',
           message: errors.CATEGORY.NAME_REQUIRED
         });
         return;
      }
      const category = await categoryService.createCategory(name);
      res.status(201).json(category);
    } catch {
      res.status(500).json({
        code: 'CREATE_FAILED',
        message: errors.CATEGORY.CREATE_FAILED
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        res.status(400).json({
          code: 'NAME_REQUIRED',
          message: errors.CATEGORY.NAME_REQUIRED
        });
        return;
      }
      const category = await categoryService.updateCategory(Number(id), name);
      res.json(category);
    } catch {
      res.status(500).json({
        code: 'UPDATE_FAILED',
        message: errors.CATEGORY.UPDATE_FAILED
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(Number(id));
      res.status(204).send();
    } catch {
      res.status(500).json({
        code: 'DELETE_FAILED',
        message: errors.CATEGORY.DELETE_FAILED
      });
    }
  }
}
