/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import errors from '../constants/errors.json' with { type: 'json' };

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(400).json({
        code: 'CREATE_FAILED',
        message:
          message === errors.Common.UNKNOWN_ERROR
            ? errors.PRODUCT.CREATE_FAILED
            : message,
      });
    }
  }

  // GET /products
  async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined;

      const result = await productService.getAllProducts({
        page,
        limit,
        search,
        categoryId,
      });
      res.json(result);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(500).json({
        code: 'FETCH_FAILED',
        message:
          message === errors.Common.UNKNOWN_ERROR
            ? errors.PRODUCT.FETCH_FAILED
            : message,
      });
    }
  }

  // GET /products/:id
  async getOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.getProductById(id);
      if (!product) {
        res.status(404).json({
          code: 'NOT_FOUND',
          message: errors.PRODUCT.NOT_FOUND,
        });
        return;
      }
      res.json(product);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(500).json({
        code: 'FETCH_FAILED',
        message: message,
      });
    }
  }

  // PUT /products/:id
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.updateProduct(id, req.body);
      res.json(product);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(400).json({
        code: 'UPDATE_FAILED',
        message:
          message === errors.Common.UNKNOWN_ERROR
            ? errors.PRODUCT.UPDATE_FAILED
            : message,
      });
    }
  }

  // DELETE /products/:id
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await productService.deleteProduct(id);
      res.status(204).send();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : errors.Common.UNKNOWN_ERROR;
      res.status(500).json({
        code: 'DELETE_FAILED',
        message:
          message === errors.Common.UNKNOWN_ERROR
            ? errors.PRODUCT.DELETE_FAILED
            : message,
      });
    }
  }
}
