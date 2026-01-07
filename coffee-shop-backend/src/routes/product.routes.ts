import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();
const productController = new ProductController();

// Define routes using .bind() to keep 'this' context if needed (though class methods here don't use 'this' for state)
router.post('/', productController.create.bind(productController));
router.get('/', productController.getAll.bind(productController));
router.get('/:id', productController.getOne.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

export default router;
