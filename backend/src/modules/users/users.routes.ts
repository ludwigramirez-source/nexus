import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private
 */
router.get('/', UsersController.getAll);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', UsersController.getById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/:id', authorize(['CEO', 'DEV_DIRECTOR']), UsersController.update);

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Update user status
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.patch('/:id/status', authorize(['CEO', 'DEV_DIRECTOR']), UsersController.updateStatus);

/**
 * @route   PATCH /api/users/:id/password
 * @desc    Update user password
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.patch('/:id/password', authorize(['CEO', 'DEV_DIRECTOR']), UsersController.updatePassword);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (soft delete)
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.delete('/:id', authorize(['CEO', 'DEV_DIRECTOR']), UsersController.delete);

export default router;
