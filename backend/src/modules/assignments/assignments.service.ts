import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import type {
  CreateAssignmentDTO,
  UpdateAssignmentDTO,
  AssignmentFilters,
  AssignmentResponse,
  CapacitySummary,
} from './assignments.types';

export class AssignmentsService {
  /**
   * Get all assignments with filters
   */
  static async getAll(filters: AssignmentFilters) {
    try {
      const { userId, requestId, weekStart, status, page = 1, limit = 20 } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (userId) where.userId = userId;
      if (requestId) where.requestId = requestId;
      if (status) where.status = status;
      if (weekStart) where.weekStart = new Date(weekStart);

      // Get total count
      const total = await prisma.assignment.count({ where });

      // Get assignments
      const assignments = await prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { weekStart: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      return {
        assignments: assignments as AssignmentResponse[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting assignments:', error);
      throw error;
    }
  }

  /**
   * Get assignment by ID
   */
  static async getById(id: string): Promise<AssignmentResponse> {
    try {
      const assignment = await prisma.assignment.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      if (!assignment) {
        throw new AppError('Assignment not found', 404);
      }

      return assignment as AssignmentResponse;
    } catch (error) {
      logger.error('Error getting assignment by ID:', error);
      throw error;
    }
  }

  /**
   * Create new assignment
   */
  static async create(data: CreateAssignmentDTO): Promise<AssignmentResponse> {
    try {
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify request exists
      const request = await prisma.request.findUnique({
        where: { id: data.requestId },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      const weekStart = new Date(data.weekStart);

      // Check if assignment already exists for this user, request, and week
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          userId: data.userId,
          requestId: data.requestId,
          weekStart,
        },
      });

      if (existingAssignment) {
        throw new AppError('Assignment already exists for this week', 409);
      }

      // Check capacity
      const weekAssignments = await prisma.assignment.findMany({
        where: {
          userId: data.userId,
          weekStart,
        },
      });

      const totalAllocated = weekAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);

      if (totalAllocated + data.allocatedHours > user.capacity) {
        throw new AppError(
          `Cannot allocate ${data.allocatedHours} hours. User has ${user.capacity - totalAllocated} hours available.`,
          400
        );
      }

      const assignment = await prisma.assignment.create({
        data: {
          userId: data.userId,
          requestId: data.requestId,
          weekStart,
          allocatedHours: data.allocatedHours,
          notes: data.notes,
          status: 'PLANNED',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      logger.info(`Assignment created: ${assignment.id}`);

      return assignment as AssignmentResponse;
    } catch (error) {
      logger.error('Error creating assignment:', error);
      throw error;
    }
  }

  /**
   * Update assignment
   */
  static async update(id: string, data: UpdateAssignmentDTO): Promise<AssignmentResponse> {
    try {
      const existingAssignment = await prisma.assignment.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

      if (!existingAssignment) {
        throw new AppError('Assignment not found', 404);
      }

      // Check capacity if allocatedHours is being updated
      if (data.allocatedHours && data.allocatedHours !== existingAssignment.allocatedHours) {
        const weekAssignments = await prisma.assignment.findMany({
          where: {
            userId: existingAssignment.userId,
            weekStart: existingAssignment.weekStart,
            id: { not: id }, // Exclude current assignment
          },
        });

        const totalAllocated = weekAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);

        if (totalAllocated + data.allocatedHours > existingAssignment.user.capacity) {
          throw new AppError(
            `Cannot allocate ${data.allocatedHours} hours. User has ${existingAssignment.user.capacity - totalAllocated} hours available.`,
            400
          );
        }
      }

      const assignment = await prisma.assignment.update({
        where: { id },
        data: {
          allocatedHours: data.allocatedHours,
          actualHours: data.actualHours,
          status: data.status,
          notes: data.notes,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      logger.info(`Assignment updated: ${id}`);

      return assignment as AssignmentResponse;
    } catch (error) {
      logger.error('Error updating assignment:', error);
      throw error;
    }
  }

  /**
   * Delete assignment
   */
  static async delete(id: string): Promise<void> {
    try {
      const assignment = await prisma.assignment.findUnique({
        where: { id },
      });

      if (!assignment) {
        throw new AppError('Assignment not found', 404);
      }

      await prisma.assignment.delete({
        where: { id },
      });

      logger.info(`Assignment deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting assignment:', error);
      throw error;
    }
  }

  /**
   * Get assignments by week
   */
  static async getByWeek(weekStart: string): Promise<AssignmentResponse[]> {
    try {
      const assignments = await prisma.assignment.findMany({
        where: {
          weekStart: new Date(weekStart),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      return assignments as AssignmentResponse[];
    } catch (error) {
      logger.error('Error getting assignments by week:', error);
      throw error;
    }
  }

  /**
   * Get assignments by user
   */
  static async getByUser(userId: string): Promise<AssignmentResponse[]> {
    try {
      const assignments = await prisma.assignment.findMany({
        where: {
          userId,
        },
        orderBy: { weekStart: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      return assignments as AssignmentResponse[];
    } catch (error) {
      logger.error('Error getting assignments by user:', error);
      throw error;
    }
  }

  /**
   * Get capacity summary
   */
  static async getCapacitySummary(weekStart?: string): Promise<CapacitySummary[]> {
    try {
      // Default to current week
      const targetWeekStart = weekStart ? new Date(weekStart) : this.getWeekStart(new Date());

      // Get all users
      const users = await prisma.user.findMany({
        where: {
          status: 'ACTIVE',
        },
        select: {
          id: true,
          name: true,
          capacity: true,
        },
      });

      // Get assignments for the week
      const assignments = await prisma.assignment.findMany({
        where: {
          weekStart: targetWeekStart,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              capacity: true,
            },
          },
          request: {
            select: {
              id: true,
              title: true,
              type: true,
              priority: true,
              status: true,
            },
          },
        },
      });

      // Build summary for each user
      const summary: CapacitySummary[] = users.map((user) => {
        const userAssignments = assignments.filter((a) => a.userId === user.id);
        const totalAllocated = userAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);
        const totalCompleted = userAssignments.reduce((sum, a) => sum + a.actualHours, 0);
        const utilization = user.capacity > 0 ? (totalAllocated / user.capacity) * 100 : 0;

        return {
          userId: user.id,
          userName: user.name,
          weekStart: targetWeekStart,
          capacity: user.capacity,
          totalAllocated,
          totalCompleted,
          utilization: Math.round(utilization * 100) / 100,
          assignments: userAssignments as AssignmentResponse[],
        };
      });

      return summary;
    } catch (error) {
      logger.error('Error getting capacity summary:', error);
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
