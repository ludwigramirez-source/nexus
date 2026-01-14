import { Router } from 'express';
import { ProductsController } from './products.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Private
 */
router.get('/', ProductsController.getAll);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', ProductsController.getById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private
 */
router.post('/', ProductsController.create);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private
 */
router.put('/:id', ProductsController.update);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete('/:id', ProductsController.delete);

/**
 * @route   GET /api/products/:id/roadmap
 * @desc    Get product roadmap
 * @access  Private
 */
router.get('/:id/roadmap', ProductsController.getRoadmap);

/**
 * @route   POST /api/products/:id/roadmap
 * @desc    Create roadmap item
 * @access  Private
 */
router.post('/:id/roadmap', ProductsController.createRoadmapItem);

/**
 * @route   PUT /api/products/:productId/roadmap/:itemId
 * @desc    Update roadmap item
 * @access  Private
 */
router.put('/:productId/roadmap/:itemId', ProductsController.updateRoadmapItem);

/**
 * @route   DELETE /api/products/:productId/roadmap/:itemId
 * @desc    Delete roadmap item
 * @access  Private
 */
router.delete('/:productId/roadmap/:itemId', ProductsController.deleteRoadmapItem);

export default router;
