import { Router } from 'express';
import { AssignmentsController } from './assignments.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/assignments/bulk
 * @desc    Create multiple assignments (bulk)
 * @access  Private
 */
router.post('/bulk', AssignmentsController.createBulk);

/**
 * @route   GET /api/assignments/capacity-summary
 * @desc    Get capacity summary
 * @access  Private
 */
router.get('/capacity-summary', AssignmentsController.getCapacitySummary);

/**
 * @route   GET /api/assignments/daily-capacity-summary
 * @desc    Get daily capacity summary
 * @access  Private
 */
router.get('/daily-capacity-summary', AssignmentsController.getDailyCapacitySummary);

/**
 * @route   GET /api/assignments/by-date-range
 * @desc    Get assignments by date range
 * @access  Private
 */
router.get('/by-date-range', AssignmentsController.getByDateRange);

/**
 * @route   GET /api/assignments/by-week/:weekStart
 * @desc    Get assignments by week
 * @access  Private
 */
router.get('/by-week/:weekStart', AssignmentsController.getByWeek);

/**
 * @route   GET /api/assignments/by-user/:userId
 * @desc    Get assignments by user
 * @access  Private
 */
router.get('/by-user/:userId', AssignmentsController.getByUser);

/**
 * @route   GET /api/assignments
 * @desc    Get all assignments with filters
 * @access  Private
 */
router.get('/', AssignmentsController.getAll);

/**
 * @route   GET /api/assignments/:id
 * @desc    Get assignment by ID
 * @access  Private
 */
router.get('/:id', AssignmentsController.getById);

/**
 * @route   POST /api/assignments
 * @desc    Create new assignment
 * @access  Private
 */
router.post('/', AssignmentsController.create);

/**
 * @route   PUT /api/assignments/:id
 * @desc    Update assignment
 * @access  Private
 */
router.put('/:id', AssignmentsController.update);

/**
 * @route   DELETE /api/assignments/:id
 * @desc    Delete assignment
 * @access  Private
 */
router.delete('/:id', AssignmentsController.delete);

export default router;
