import { Router } from 'express';
import { ClientsController } from './clients.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/clients
 * @desc    Get all clients
 * @access  Private
 */
router.get('/', ClientsController.getAll);

/**
 * @route   GET /api/clients/:id
 * @desc    Get client by ID
 * @access  Private
 */
router.get('/:id', ClientsController.getById);

/**
 * @route   POST /api/clients
 * @desc    Create new client
 * @access  Private
 */
router.post('/', ClientsController.create);

/**
 * @route   PUT /api/clients/:id
 * @desc    Update client
 * @access  Private
 */
router.put('/:id', ClientsController.update);

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete client
 * @access  Private
 */
router.delete('/:id', ClientsController.delete);

/**
 * @route   GET /api/clients/:id/requests
 * @desc    Get client requests
 * @access  Private
 */
router.get('/:id/requests', ClientsController.getRequests);

/**
 * @route   PATCH /api/clients/:id/health-score
 * @desc    Update client health score
 * @access  Private
 */
router.patch('/:id/health-score', ClientsController.updateHealthScore);

export default router;
