import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();
const categoryController = new CategoryController();

router.get('/', authenticateToken, categoryController.getAll.bind(categoryController));
router.post('/', authenticateToken, categoryController.create.bind(categoryController));
router.put('/:id', authenticateToken, categoryController.update.bind(categoryController));
router.delete('/:id', authenticateToken, categoryController.delete.bind(categoryController));

export default router;
