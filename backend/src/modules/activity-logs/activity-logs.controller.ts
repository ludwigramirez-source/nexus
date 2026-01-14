import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ActivityLogsService } from './activity-logs.service';
import { successResponse, errorResponse } from '../../utils/response.util';
import logger from '../../config/logger';

export class ActivityLogsController {
  /**
   * Check if user is admin/CEO (can see all logs)
   */
  private static isAdmin(role: string): boolean {
    const adminRoles = ['CEO', 'ADMIN', 'DEV_DIRECTOR', 'CTO', 'LEAD'];
    return adminRoles.includes(role.toUpperCase());
  }

  /**
   * Get all activity logs with filters
   */
  static async getAll(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userRole = req.user?.role || '';
      const currentUserId = req.user?.userId;

      logger.info(`Activity logs request - Role: ${userRole}, UserId: ${currentUserId}`);

      const filters = {
        userId: (req.query.userId as string) || undefined,
        action: (req.query.action as string) || undefined,
        entity: (req.query.entity as string) || undefined,
        startDate: (req.query.startDate as string) || undefined,
        endDate: (req.query.endDate as string) || undefined,
        search: (req.query.search as string) || undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      // If user is not admin AND no userId filter is specified, force filter by their own userId
      if (!ActivityLogsController.isAdmin(userRole) && !filters.userId && currentUserId) {
        filters.userId = currentUserId;
        logger.info('Non-admin user, filtering by their userId');
      } else {
        logger.info('Admin user or userId filter specified, showing all logs');
      }

      logger.info('Filters:', filters);

      const result = await ActivityLogsService.getAll(filters);

      logger.info(`Retrieved ${result.logs.length} logs`);

      return successResponse(res, result, 'Activity logs retrieved successfully');
    } catch (error) {
      logger.error('Error in getAll activity logs controller:', error);
      if (error instanceof Error) {
        logger.error('Error message:', error.message);
        logger.error('Error stack:', error.stack);
      }
      return errorResponse(res, 'Failed to retrieve activity logs', 500);
    }
  }

  /**
   * Get recent activity logs
   */
  static async getRecent(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const userRole = req.user?.role || '';
      const currentUserId = req.user?.userId;

      // If user is not admin, only get their own logs
      if (!ActivityLogsController.isAdmin(userRole) && currentUserId) {
        const logs = await ActivityLogsService.getByUser(currentUserId, limit);
        return successResponse(res, { logs }, 'Recent activity logs retrieved successfully');
      }

      const logs = await ActivityLogsService.getRecent(limit);
      return successResponse(res, { logs }, 'Recent activity logs retrieved successfully');
    } catch (error) {
      logger.error('Error in getRecent activity logs controller:', error);
      return errorResponse(res, 'Failed to retrieve recent activity logs', 500);
    }
  }

  /**
   * Get activity logs by user
   */
  static async getByUser(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const userRole = req.user?.role || '';
      const currentUserId = req.user?.userId || '';
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      // If user is not admin, they can only see their own logs
      if (!ActivityLogsController.isAdmin(userRole) && userId !== currentUserId) {
        return errorResponse(res, 'Unauthorized to view other users logs', 403);
      }

      const logs = await ActivityLogsService.getByUser(userId, limit);

      return successResponse(res, { logs }, 'User activity logs retrieved successfully');
    } catch (error) {
      logger.error('Error in getByUser activity logs controller:', error);
      return errorResponse(res, 'Failed to retrieve user activity logs', 500);
    }
  }

  /**
   * Get statistics (admin only)
   */
  static async getStatistics(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userRole = req.user?.role || '';

      // Only admins can see statistics
      if (!ActivityLogsController.isAdmin(userRole)) {
        return errorResponse(res, 'Unauthorized to view statistics', 403);
      }

      const stats = await ActivityLogsService.getStatistics();

      return successResponse(res, stats, 'Activity log statistics retrieved successfully');
    } catch (error) {
      logger.error('Error in getStatistics activity logs controller:', error);
      return errorResponse(res, 'Failed to retrieve statistics', 500);
    }
  }

  /**
   * Export activity logs to CSV
   */
  static async exportToCsv(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userRole = req.user?.role || '';
      const currentUserId = req.user?.userId;

      const filters = {
        userId: (req.query.userId as string) || undefined,
        action: (req.query.action as string) || undefined,
        entity: (req.query.entity as string) || undefined,
        startDate: (req.query.startDate as string) || undefined,
        endDate: (req.query.endDate as string) || undefined,
        search: (req.query.search as string) || undefined,
        page: 1,
        limit: 10000, // Export max 10k records
      };

      // If user is not admin AND no userId filter is specified, force filter by their own userId
      if (!ActivityLogsController.isAdmin(userRole) && !filters.userId && currentUserId) {
        filters.userId = currentUserId;
      }

      const result = await ActivityLogsService.getAll(filters);

      // Build CSV
      const headers = [
        'ID',
        'Usuario',
        'Email',
        'Acción',
        'Entidad',
        'ID Entidad',
        'Descripción',
        'IP',
        'Fecha y Hora',
      ];

      const rows = result.logs.map((log) => [
        log.id,
        log.userName,
        log.userEmail || '',
        log.action,
        log.entity,
        log.entityId || '',
        log.description.replace(/"/g, '""'), // Escape quotes
        log.ipAddress || '',
        new Date(log.createdAt).toLocaleString('es-ES'),
      ]);

      // Generate CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      // Set response headers
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="activity-logs-${Date.now()}.csv"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));

      // Send CSV
      res.status(200).send('\uFEFF' + csvContent); // Add BOM for Excel compatibility
    } catch (error) {
      logger.error('Error in exportToCsv activity logs controller:', error);
      res.status(500).json({ success: false, message: 'Failed to export activity logs' });
    }
  }

  /**
   * Delete old logs (admin only)
   */
  static async deleteOldLogs(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userRole = req.user?.role || '';

      // Only admins can delete logs
      if (!ActivityLogsController.isAdmin(userRole)) {
        return errorResponse(res, 'Unauthorized to delete logs', 403);
      }

      const daysToKeep = req.body.daysToKeep || 90;
      const deletedCount = await ActivityLogsService.deleteOldLogs(daysToKeep);

      return successResponse(res, { deletedCount }, `Deleted ${deletedCount} old activity logs`);
    } catch (error) {
      logger.error('Error in deleteOldLogs activity logs controller:', error);
      return errorResponse(res, 'Failed to delete old logs', 500);
    }
  }
}
