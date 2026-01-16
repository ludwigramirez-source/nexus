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
      const { userId, requestId, assignedDate, status, page = 1, limit = 20 } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (userId) where.userId = userId;
      if (requestId) where.requestId = requestId;
      if (status) where.status = status;
      if (assignedDate) where.assignedDate = new Date(assignedDate);

      // Get total count
      const total = await prisma.assignment.count({ where });

      // Get assignments
      const assignments = await prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { assignedDate: 'desc' },
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

      const assignedDate = new Date(data.assignedDate);
      assignedDate.setHours(0, 0, 0, 0);

      // Check capacity - DIARIA (no semanal)
      const dayAssignments = await prisma.assignment.findMany({
        where: {
          userId: data.userId,
          assignedDate,
        },
      });

      const totalAllocated = dayAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);
      const dailyCapacity = user.capacity / 5; // 40h/semana ÷ 5 días = 8h/día

      if (totalAllocated + data.allocatedHours > dailyCapacity) {
        throw new AppError(
          `Cannot allocate ${data.allocatedHours} hours. User has ${dailyCapacity - totalAllocated} hours available for ${assignedDate.toLocaleDateString('es')}.`,
          400
        );
      }

      const assignment = await prisma.assignment.create({
        data: {
          userId: data.userId,
          requestId: data.requestId,
          assignedDate,
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
   * Create multiple assignments (bulk creation for multi-day distribution)
   */
  static async createBulk(assignments: CreateAssignmentDTO[]): Promise<AssignmentResponse[]> {
    try {
      // Validar capacidad diaria para cada asignación
      const validationErrors: string[] = [];

      for (const assignment of assignments) {
        const date = new Date(assignment.assignedDate);
        date.setHours(0, 0, 0, 0);

        // Obtener usuario
        const user = await prisma.user.findUnique({ where: { id: assignment.userId } });
        if (!user) {
          validationErrors.push(`User ${assignment.userId} not found`);
          continue;
        }

        // Calcular capacidad diaria usada
        const dayAssignments = await prisma.assignment.findMany({
          where: { userId: assignment.userId, assignedDate: date },
        });

        const totalAllocated = dayAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);
        const dailyCapacity = user.capacity / 5; // capacity = 40h/semana → 8h/día

        if (totalAllocated + assignment.allocatedHours > dailyCapacity) {
          validationErrors.push(
            `${user.name} - ${date.toLocaleDateString('es')}: Cannot allocate ${assignment.allocatedHours}h. ` +
              `Has ${dailyCapacity - totalAllocated}h available (${dailyCapacity}h capacity).`
          );
        }
      }

      if (validationErrors.length > 0) {
        throw new AppError(validationErrors.join('\n'), 400);
      }

      // Crear asignaciones en transacción
      const created = await prisma.$transaction(
        assignments.map((a) =>
          prisma.assignment.create({
            data: {
              userId: a.userId,
              requestId: a.requestId,
              assignedDate: new Date(a.assignedDate),
              allocatedHours: a.allocatedHours,
              notes: a.notes,
              status: 'PLANNED',
            },
            include: {
              user: { select: { id: true, name: true, email: true, capacity: true } },
              request: { select: { id: true, title: true, type: true, priority: true, status: true } },
            },
          })
        )
      );

      logger.info(`${created.length} assignments created in bulk`);

      return created as AssignmentResponse[];
    } catch (error) {
      logger.error('Error creating bulk assignments:', error);
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
        const dayAssignments = await prisma.assignment.findMany({
          where: {
            userId: existingAssignment.userId,
            assignedDate: existingAssignment.assignedDate,
            id: { not: id }, // Exclude current assignment
          },
        });

        const totalAllocated = dayAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);
        const dailyCapacity = existingAssignment.user.capacity / 5; // Capacidad diaria

        if (totalAllocated + data.allocatedHours > dailyCapacity) {
          throw new AppError(
            `Cannot allocate ${data.allocatedHours} hours. User has ${dailyCapacity - totalAllocated} hours available.`,
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
   * Get assignments by date range
   */
  static async getByDateRange(startDate: string, endDate: string): Promise<AssignmentResponse[]> {
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const assignments = await prisma.assignment.findMany({
        where: {
          assignedDate: { gte: start, lte: end },
        },
        orderBy: { assignedDate: 'asc' },
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
              estimatedHours: true,
            },
          },
        },
      });

      return assignments as AssignmentResponse[];
    } catch (error) {
      logger.error('Error getting assignments by date range:', error);
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
        orderBy: { assignedDate: 'desc' },
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
   * Get daily capacity summary for a specific date
   */
  static async getDailyCapacitySummary(date: string): Promise<any[]> {
    try {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      const users = await prisma.user.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, name: true, capacity: true },
      });

      const assignments = await prisma.assignment.findMany({
        where: { assignedDate: targetDate },
        include: {
          request: { select: { id: true, title: true, type: true, priority: true } },
        },
      });

      return users.map((user) => {
        const userAssignments = assignments.filter((a) => a.userId === user.id);
        const totalAllocated = userAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);
        const dailyCapacity = user.capacity / 5;
        const utilization = dailyCapacity > 0 ? (totalAllocated / dailyCapacity) * 100 : 0;

        return {
          userId: user.id,
          userName: user.name,
          date: targetDate,
          dailyCapacity,
          totalAllocated,
          available: dailyCapacity - totalAllocated,
          utilization: Math.round(utilization * 100) / 100,
          assignments: userAssignments,
        };
      });
    } catch (error) {
      logger.error('Error getting daily capacity summary:', error);
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
      targetWeekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(targetWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 4); // Lun-Vie (5 días)
      weekEnd.setHours(23, 59, 59, 999);

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

      // Get assignments for the week using date range
      const assignments = await prisma.assignment.findMany({
        where: {
          assignedDate: { gte: targetWeekStart, lte: weekEnd },
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
   * Get week start date (Monday)
   */
  private static getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Si es domingo (-6), sino (1 - día actual)
    weekStart.setDate(weekStart.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }
}
