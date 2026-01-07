import type { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
  // POST /products
  async create(req: Request, res: Response) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  // GET /products
  async getAll(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }

  // GET /products/:id
  async getOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.getProductById(id);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(product);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }

  // PUT /products/:id
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await productService.updateProduct(id, req.body);
      res.json(product);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({ error: message });
    }
  }

  // DELETE /products/:id
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await productService.deleteProduct(id);
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: message });
    }
  }
}
