import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import { generateAnalyticsInsights } from '../../utils/ai.service';
import type {
  CreateWeeklyMetricDTO,
  DateRangeDTO,
  WeeklyMetricResponse,
  OverviewMetrics,
  CapacityMetrics,
  RequestsFunnelMetrics,
  ProductVsCustomMetrics,
  TeamVelocityMetrics,
  AIInsights,
} from './metrics.types';

export class MetricsService {
  /**
   * Get overview metrics
   */
  static async getOverview(): Promise<OverviewMetrics> {
    try {
      // Total requests
      const totalRequests = await prisma.request.count();

      // Active requests
      const activeRequests = await prisma.request.count({
        where: {
          status: {
            in: ['INTAKE', 'IN_PROGRESS', 'REVIEW'],
          },
        },
      });

      // Completed requests
      const completedRequests = await prisma.request.count({
        where: {
          status: {
            in: ['DONE'],
          },
        },
      });

      // Total clients
      const totalClients = await prisma.client.count();

      // Total products
      const totalProducts = await prisma.product.count();

      // Average utilization (last 4 weeks)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const weeklyMetrics = await prisma.weeklyMetric.findMany({
        where: {
          weekStart: {
            gte: fourWeeksAgo,
          },
        },
      });

      const averageUtilization =
        weeklyMetrics.length > 0
          ? weeklyMetrics.reduce((sum, m) => sum + m.teamUtilization, 0) / weeklyMetrics.length
          : 0;

      // Requests by status
      const requestsByStatus = await prisma.request.groupBy({
        by: ['status'],
        _count: true,
      });

      const requestsByStatusMap: Record<string, number> = {};
      requestsByStatus.forEach((item) => {
        requestsByStatusMap[item.status] = item._count;
      });

      // Requests by type
      const requestsByType = await prisma.request.groupBy({
        by: ['type'],
        _count: true,
      });

      const requestsByTypeMap: Record<string, number> = {};
      requestsByType.forEach((item) => {
        requestsByTypeMap[item.type] = item._count;
      });

      // Requests by priority
      const requestsByPriority = await prisma.request.groupBy({
        by: ['priority'],
        _count: true,
      });

      const requestsByPriorityMap: Record<string, number> = {};
      requestsByPriority.forEach((item) => {
        requestsByPriorityMap[item.priority] = item._count;
      });

      return {
        totalRequests,
        activeRequests,
        completedRequests,
        totalClients,
        totalProducts,
        averageUtilization: Math.round(averageUtilization * 100) / 100,
        requestsByStatus: requestsByStatusMap,
        requestsByType: requestsByTypeMap,
        requestsByPriority: requestsByPriorityMap,
      };
    } catch (error) {
      logger.error('Error getting overview metrics:', error);
      throw error;
    }
  }

  /**
   * Get weekly metrics
   */
  static async getWeeklyMetrics(dateRange?: DateRangeDTO): Promise<WeeklyMetricResponse[]> {
    try {
      const where: any = {};

      if (dateRange) {
        where.weekStart = {};
        if (dateRange.startDate) {
          where.weekStart.gte = new Date(dateRange.startDate);
        }
        if (dateRange.endDate) {
          where.weekStart.lte = new Date(dateRange.endDate);
        }
      }

      const metrics = await prisma.weeklyMetric.findMany({
        where,
        orderBy: { weekStart: 'desc' },
      });

      return metrics;
    } catch (error) {
      logger.error('Error getting weekly metrics:', error);
      throw error;
    }
  }

  /**
   * Create weekly metric
   */
  static async createWeeklyMetric(data: CreateWeeklyMetricDTO): Promise<WeeklyMetricResponse> {
    try {
      const weekStart = new Date(data.weekStart);

      // Check if metric already exists for this week
      const existingMetric = await prisma.weeklyMetric.findFirst({
        where: { weekStart },
      });

      if (existingMetric) {
        throw new AppError('Metric for this week already exists', 409);
      }

      const metric = await prisma.weeklyMetric.create({
        data: {
          weekStart,
          totalRequests: data.totalRequests,
          completedRequests: data.completedRequests,
          productRequests: data.productRequests,
          customRequests: data.customRequests,
          totalHours: data.totalHours,
          teamUtilization: data.teamUtilization,
          notes: data.notes,
        },
      });

      logger.info(`Weekly metric created for week: ${weekStart}`);

      return metric;
    } catch (error) {
      logger.error('Error creating weekly metric:', error);
      throw error;
    }
  }

  /**
   * Get capacity metrics
   */
  static async getCapacityMetrics(): Promise<CapacityMetrics> {
    try {
      // Get current week start
      const currentWeekStart = this.getWeekStart(new Date());

      // Get all active users
      const users = await prisma.user.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          name: true,
          capacity: true,
        },
      });

      const totalCapacity = users.reduce((sum, u) => sum + u.capacity, 0);

      // Get assignments for current week
      const assignments = await prisma.assignment.findMany({
        where: {
          weekStart: currentWeekStart,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              capacity: true,
            },
          },
        },
      });

      const usedCapacity = assignments.reduce((sum, a) => sum + a.allocatedHours, 0);
      const availableCapacity = totalCapacity - usedCapacity;
      const utilizationPercentage = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

      // By user
      const byUser = users.map((user) => {
        const userAssignments = assignments.filter((a) => a.userId === user.id);
        const allocated = userAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);
        const available = user.capacity - allocated;
        const utilization = user.capacity > 0 ? (allocated / user.capacity) * 100 : 0;

        return {
          userId: user.id,
          userName: user.name,
          capacity: user.capacity,
          allocated,
          available,
          utilization: Math.round(utilization * 100) / 100,
        };
      });

      return {
        totalCapacity,
        usedCapacity,
        availableCapacity,
        utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
        byUser,
      };
    } catch (error) {
      logger.error('Error getting capacity metrics:', error);
      throw error;
    }
  }

  /**
   * Get requests funnel metrics
   */
  static async getRequestsFunnel(): Promise<RequestsFunnelMetrics> {
    try {
      const pending = await prisma.request.count({ where: { status: 'INTAKE' } });
      const inProgress = await prisma.request.count({ where: { status: 'IN_PROGRESS' } });
      const review = await prisma.request.count({ where: { status: 'REVIEW' } });
      const completed = await prisma.request.count({ where: { status: 'COMPLETED' } });
      const deployed = await prisma.request.count({ where: { status: 'DEPLOYED' } });
      const cancelled = await prisma.request.count({ where: { status: 'REJECTED' } });

      // Calculate average completion time
      const completedRequests = await prisma.request.findMany({
        where: {
          status: {
            in: ['DONE'],
          },
        },
        select: {
          createdAt: true,
          updatedAt: true,
        },
      });

      const totalCompletionTime = completedRequests.reduce((sum, r) => {
        const diff = r.updatedAt.getTime() - r.createdAt.getTime();
        return sum + diff;
      }, 0);

      const averageCompletionTime =
        completedRequests.length > 0
          ? totalCompletionTime / completedRequests.length / (1000 * 60 * 60 * 24) // Convert to days
          : 0;

      return {
        pending,
        inProgress,
        review,
        completed,
        deployed,
        cancelled,
        averageCompletionTime: Math.round(averageCompletionTime * 100) / 100,
      };
    } catch (error) {
      logger.error('Error getting requests funnel:', error);
      throw error;
    }
  }

  /**
   * Get product vs custom metrics
   */
  static async getProductVsCustom(): Promise<ProductVsCustomMetrics> {
    try {
      const productRequests = await prisma.request.count({
        where: { type: 'PRODUCT_FEATURE' },
      });

      const customRequests = await prisma.request.count({
        where: { type: 'CUSTOMIZATION' },
      });

      const total = productRequests + customRequests;
      const productPercentage = total > 0 ? (productRequests / total) * 100 : 0;
      const customPercentage = total > 0 ? (customRequests / total) * 100 : 0;

      // By product
      const requestsByProduct = await prisma.request.groupBy({
        by: ['productId'],
        where: {
          productId: { not: null },
        },
        _count: true,
      });

      const byProduct: Record<string, number> = {};
      requestsByProduct.forEach((item) => {
        if (item.productId) {
          byProduct[item.productId] = item._count;
        }
      });

      return {
        productRequests,
        customRequests,
        productPercentage: Math.round(productPercentage * 100) / 100,
        customPercentage: Math.round(customPercentage * 100) / 100,
        byProduct,
      };
    } catch (error) {
      logger.error('Error getting product vs custom metrics:', error);
      throw error;
    }
  }

  /**
   * Get team velocity metrics
   */
  static async getTeamVelocity(): Promise<TeamVelocityMetrics> {
    try {
      // Last 12 weeks
      const twelveWeeksAgo = new Date();
      twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

      const weeklyMetrics = await prisma.weeklyMetric.findMany({
        where: {
          weekStart: {
            gte: twelveWeeksAgo,
          },
        },
        orderBy: { weekStart: 'desc' },
      });

      const averageRequestsPerWeek =
        weeklyMetrics.length > 0
          ? weeklyMetrics.reduce((sum, m) => sum + m.completedRequests, 0) / weeklyMetrics.length
          : 0;

      // Average hours per request (from all completed requests)
      const completedRequests = await prisma.request.findMany({
        where: {
          status: {
            in: ['DONE'],
          },
          actualHours: { not: null },
        },
        select: {
          actualHours: true,
        },
      });

      const averageHoursPerRequest =
        completedRequests.length > 0
          ? completedRequests.reduce((sum, r) => sum + (r.actualHours || 0), 0) / completedRequests.length
          : 0;

      // Completion rate
      const totalRequests = await prisma.request.count();
      const completed = await prisma.request.count({
        where: {
          status: {
            in: ['DONE'],
          },
        },
      });

      const completionRate = totalRequests > 0 ? (completed / totalRequests) * 100 : 0;

      // Weekly trend
      const weeklyTrend = weeklyMetrics.map((m) => ({
        week: m.weekStart.toISOString().split('T')[0],
        requestsCompleted: m.completedRequests,
        hoursWorked: m.totalHours,
      }));

      return {
        averageRequestsPerWeek: Math.round(averageRequestsPerWeek * 100) / 100,
        averageHoursPerRequest: Math.round(averageHoursPerRequest * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        weeklyTrend,
      };
    } catch (error) {
      logger.error('Error getting team velocity:', error);
      throw error;
    }
  }

  /**
   * Generate AI insights
   */
  static async generateInsights(): Promise<AIInsights> {
    try {
      // Gather all metrics
      const overview = await this.getOverview();
      const capacity = await this.getCapacityMetrics();
      const funnel = await this.getRequestsFunnel();
      const productVsCustom = await this.getProductVsCustom();
      const velocity = await this.getTeamVelocity();

      const metricsData = {
        overview,
        capacity,
        funnel,
        productVsCustom,
        velocity,
      };

      // Generate insights using AI
      const insights = await generateAnalyticsInsights(metricsData);

      return insights;
    } catch (error) {
      logger.error('Error generating AI insights:', error);
      throw error;
    }
  }

  /**
   * Get week start date (Sunday)
   */
  private static getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }
}
