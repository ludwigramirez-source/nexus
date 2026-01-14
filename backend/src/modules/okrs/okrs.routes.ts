import { Router } from 'express';
import { OKRsController } from './okrs.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/okrs
 * @desc    Get all OKRs with filters
 * @access  Private
 */
router.get('/', OKRsController.getAll);

/**
 * @route   GET /api/okrs/:id
 * @desc    Get OKR by ID
 * @access  Private
 */
router.get('/:id', OKRsController.getById);

/**
 * @route   POST /api/okrs
 * @desc    Create new OKR
 * @access  Private
 */
router.post('/', OKRsController.create);

/**
 * @route   PUT /api/okrs/:id
 * @desc    Update OKR
 * @access  Private
 */
router.put('/:id', OKRsController.update);

/**
 * @route   DELETE /api/okrs/:id
 * @desc    Delete OKR
 * @access  Private
 */
router.delete('/:id', OKRsController.delete);

/**
 * @route   PATCH /api/okrs/:id/status
 * @desc    Update OKR status
 * @access  Private
 */
router.patch('/:id/status', OKRsController.updateStatus);

/**
 * @route   POST /api/okrs/:id/key-results
 * @desc    Create key result
 * @access  Private
 */
router.post('/:id/key-results', OKRsController.createKeyResult);

/**
 * @route   PUT /api/okrs/:okrId/key-results/:krId
 * @desc    Update key result
 * @access  Private
 */
router.put('/:okrId/key-results/:krId', OKRsController.updateKeyResult);

/**
 * @route   DELETE /api/okrs/:okrId/key-results/:krId
 * @desc    Delete key result
 * @access  Private
 */
router.delete('/:okrId/key-results/:krId', OKRsController.deleteKeyResult);

/**
 * @route   PATCH /api/okrs/:okrId/key-results/:krId/progress
 * @desc    Update key result progress
 * @access  Private
 */
router.patch('/:okrId/key-results/:krId/progress', OKRsController.updateKeyResultProgress);

export default router;
