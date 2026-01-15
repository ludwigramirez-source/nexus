import { Router } from 'express';
import { RequestsController } from './requests.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { TimeEntriesController } from '../time-entries/time-entries.controller';

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

/**
 * @route   GET /api/requests/:requestId/time-entries
 * @desc    Get all time entries for a request
 * @access  Private
 */
router.get('/:requestId/time-entries', TimeEntriesController.getTimeEntries);

/**
 * @route   GET /api/requests/:requestId/time-entries/active
 * @desc    Get active time entry for current user
 * @access  Private
 */
router.get('/:requestId/time-entries/active', TimeEntriesController.getActiveEntry);

/**
 * @route   POST /api/requests/:requestId/time-entries/start
 * @desc    Start a new time entry
 * @access  Private
 */
router.post('/:requestId/time-entries/start', TimeEntriesController.startTimeEntry);

/**
 * @route   PUT /api/requests/:requestId/time-entries/pause
 * @desc    Pause active time entry
 * @access  Private
 */
router.put('/:requestId/time-entries/pause', TimeEntriesController.pauseTimeEntry);

/**
 * @route   PUT /api/requests/:requestId/time-entries/resume
 * @desc    Resume paused time entry
 * @access  Private
 */
router.put('/:requestId/time-entries/resume', TimeEntriesController.resumeTimeEntry);

/**
 * @route   PUT /api/requests/:requestId/time-entries/complete
 * @desc    Complete active time entry
 * @access  Private
 */
router.put('/:requestId/time-entries/complete', TimeEntriesController.completeTimeEntry);

/**
 * @route   DELETE /api/requests/:requestId/time-entries/:timeEntryId
 * @desc    Delete a time entry
 * @access  Private
 */
router.delete('/:requestId/time-entries/:timeEntryId', TimeEntriesController.deleteTimeEntry);

export default router;
