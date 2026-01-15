import { Router } from 'express';
import { TimeEntriesController } from './time-entries.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all time entries for a request
router.get(
  '/:requestId/time-entries',
  TimeEntriesController.getTimeEntries
);

// Get active time entry for current user
router.get(
  '/:requestId/time-entries/active',
  TimeEntriesController.getActiveEntry
);

// Start a new time entry
router.post(
  '/:requestId/time-entries/start',
  TimeEntriesController.startTimeEntry
);

// Pause active time entry
router.put(
  '/:requestId/time-entries/pause',
  TimeEntriesController.pauseTimeEntry
);

// Resume paused time entry
router.put(
  '/:requestId/time-entries/resume',
  TimeEntriesController.resumeTimeEntry
);

// Complete active time entry
router.put(
  '/:requestId/time-entries/complete',
  TimeEntriesController.completeTimeEntry
);

// Delete a time entry
router.delete(
  '/:requestId/time-entries/:timeEntryId',
  TimeEntriesController.deleteTimeEntry
);

export default router;
