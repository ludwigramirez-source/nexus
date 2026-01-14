import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import type {
  CreateActivityLogDTO,
  ActivityLogFilters,
  ActivityLogWithUserResponse,
  ActivityLogsListResponse,
} from './activity-logs.types';

export class ActivityLogsService {
  /**
   * Create activity log
   */
  static async create(data: CreateActivityLogDTO): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          description: data.description,
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });

      logger.info(`Activity logged: ${data.action} on ${data.entity} by ${data.userName}`);
    } catch (error) {
      logger.error('Error creating activity log:', error);
      // Don't throw error to prevent breaking main flow
    }
  }

  /**
   * Get all activity logs with filters
   */
  static async getAll(filters: ActivityLogFilters = {}): Promise<ActivityLogsListResponse> {
    try {
      const {
        userId,
        action,
        entity,
        startDate,
        endDate,
        search,
        page = 1,
        limit = 20,
      } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (userId) {
        where.userId = userId;
      }

      if (action) {
        where.action = action;
      }

      if (entity) {
        where.entity = entity;
      }

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) {
          where.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
          where.createdAt.lte = new Date(endDate);
        }
      }

      if (search) {
        where.OR = [
          { userName: { contains: search, mode: 'insensitive' } },
          { userEmail: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await prisma.activityLog.count({ where });

      // Get logs
      const logs = await prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting activity logs:', error);
      throw error;
    }
  }

  /**
   * Get recent activity logs (for dashboard widgets)
   */
  static async getRecent(limit: number = 5): Promise<ActivityLogWithUserResponse[]> {
    try {
      const logs = await prisma.activityLog.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      return logs;
    } catch (error) {
      logger.error('Error getting recent activity logs:', error);
      throw error;
    }
  }

  /**
   * Get activity logs by user
   */
  static async getByUser(userId: string, limit: number = 20): Promise<ActivityLogWithUserResponse[]> {
    try {
      const logs = await prisma.activityLog.findMany({
        where: { userId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      return logs;
    } catch (error) {
      logger.error('Error getting user activity logs:', error);
      throw error;
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics(): Promise<any> {
    try {
      // Get total logs
      const total = await prisma.activityLog.count();

      // Get logs by action
      const byAction = await prisma.activityLog.groupBy({
        by: ['action'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      // Get logs by entity
      const byEntity = await prisma.activityLog.groupBy({
        by: ['entity'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      });

      // Get today's logs
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayLogs = await prisma.activityLog.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      });

      // Get this week's logs
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weekLogs = await prisma.activityLog.count({
        where: {
          createdAt: {
            gte: weekStart,
          },
        },
      });

      return {
        total,
        todayLogs,
        weekLogs,
        byAction,
        byEntity,
      };
    } catch (error) {
      logger.error('Error getting activity log statistics:', error);
      throw error;
    }
  }

  /**
   * Delete old logs (cleanup utility)
   */
  static async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await prisma.activityLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      logger.info(`Deleted ${result.count} old activity logs (older than ${daysToKeep} days)`);
      return result.count;
    } catch (error) {
      logger.error('Error deleting old activity logs:', error);
      throw error;
    }
  }
}
