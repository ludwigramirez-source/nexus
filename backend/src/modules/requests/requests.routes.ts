import { Router } from 'express';
import { RequestsController } from './requests.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/requests
 * @desc    Get all requests with filters and pagination
 * @access  Private
 */
router.get('/', RequestsController.getAll);

/**
 * @route   GET /api/requests/:id
 * @desc    Get request by ID
 * @access  Private
 */
router.get('/:id', RequestsController.getById);

/**
 * @route   POST /api/requests
 * @desc    Create new request
 * @access  Private
 */
router.post('/', RequestsController.create);

/**
 * @route   PUT /api/requests/:id
 * @desc    Update request
 * @access  Private
 */
router.put('/:id', RequestsController.update);

/**
 * @route   DELETE /api/requests/:id
 * @desc    Delete request
 * @access  Private
 */
router.delete('/:id', RequestsController.delete);

/**
 * @route   PATCH /api/requests/:id/status
 * @desc    Change request status
 * @access  Private
 */
router.patch('/:id/status', RequestsController.changeStatus);

/**
 * @route   PATCH /api/requests/:id/assign
 * @desc    Assign users to request
 * @access  Private
 */
router.patch('/:id/assign', RequestsController.assignUsers);

/**
 * @route   GET /api/requests/:id/activities
 * @desc    Get request activities
 * @access  Private
 */
router.get('/:id/activities', RequestsController.getActivities);

/**
 * @route   POST /api/requests/:id/activities
 * @desc    Create request activity
 * @access  Private
 */
router.post('/:id/activities', RequestsController.createActivity);

/**
 * @route   GET /api/requests/:id/comments
 * @desc    Get request comments
 * @access  Private
 */
router.get('/:id/comments', RequestsController.getComments);

/**
 * @route   POST /api/requests/:id/comments
 * @desc    Create request comment
 * @access  Private
 */
router.post('/:id/comments', RequestsController.createComment);

export default router;
