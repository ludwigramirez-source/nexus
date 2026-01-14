import { Router } from 'express';
import { ActivityLogsController } from './activity-logs.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// Get all activity logs with filters
router.get('/', authenticate, ActivityLogsController.getAll);

// Get recent activity logs (for dashboard)
router.get('/recent', authenticate, ActivityLogsController.getRecent);

// Get activity log statistics
router.get('/statistics', authenticate, ActivityLogsController.getStatistics);

// Get activity logs by user
router.get('/user/:userId', authenticate, ActivityLogsController.getByUser);

// Export activity logs to CSV
router.get('/export', authenticate, ActivityLogsController.exportToCsv);

// Delete old logs (admin only)
router.delete('/cleanup', authenticate, ActivityLogsController.deleteOldLogs);

export default router;
