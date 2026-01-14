import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import { assertValidRole } from '../../utils/role-validator.util';
import logger from '../../config/logger';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { UpdateUserDTO, UpdateUserStatusDTO, UserFilters, UserResponse, UserWithStatsResponse } from './users.types';

export class UsersService {
  /**
   * Get all users with filters
   */
  static async getAll(filters: UserFilters) {
    try {
      const { status, role, search, page = 1, limit = 20 } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (status) where.status = status;
      if (role) where.role = role;

      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await prisma.user.count({ where });

      // Get users
      const users = await prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          avatar: true,
          capacity: true,
          skills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          avatar: true,
          capacity: true,
          skills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user with statistics
   */
  static async getByIdWithStats(id: string): Promise<UserWithStatsResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          avatar: true,
          capacity: true,
          skills: true,
          createdAt: true,
          updatedAt: true,
          assignedRequests: {
            select: {
              id: true,
              status: true,
            },
          },
          assignments: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Calculate stats
      const activeRequests = user.assignedRequests.filter((r) =>
        ['IN_PROGRESS', 'REVIEW', 'BACKLOG', 'INTAKE'].includes(r.status)
      ).length;

      const completedRequests = user.assignedRequests.filter((r) =>
        ['DONE'].includes(r.status)
      ).length;

      const totalAssignments = user.assignments.length;

      // Calculate current utilization
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);

      const currentWeekAssignments = await prisma.assignment.findMany({
        where: {
          userId: id,
          weekStart: currentWeekStart,
        },
      });

      const currentUtilization = currentWeekAssignments.reduce((sum, a) => sum + a.allocatedHours, 0);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        capacity: user.capacity,
        skills: user.skills,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        stats: {
          activeRequests,
          completedRequests,
          totalAssignments,
          currentUtilization,
        },
      };
    } catch (error) {
      logger.error('Error getting user with stats:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  static async update(id: string, data: UpdateUserDTO, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<UserResponse> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // Check if email is already taken by another user
      if (data.email && data.email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (emailTaken) {
          throw new AppError('Email already in use', 409);
        }
      }

      // Validate role if provided
      if (data.role) {
        await assertValidRole(data.role);
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          role: data.role,
          avatar: data.avatar,
          capacity: data.capacity,
          skills: data.skills,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          avatar: true,
          capacity: true,
          skills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info(`User updated: ${id}`);

      // Get actor user info for activity log
      let actorUserName = 'System';
      if (sessionData?.actorUserId) {
        const actorUser = await prisma.user.findUnique({
          where: { id: sessionData.actorUserId },
          select: { name: true },
        });
        if (actorUser) {
          actorUserName = actorUser.name;
        }
      }

      // Log activity
      const changes = [];
      if (data.email && data.email !== existingUser.email) changes.push(`email to ${data.email}`);
      if (data.name && data.name !== existingUser.name) changes.push(`name to ${data.name}`);
      if (data.role && data.role !== existingUser.role) changes.push(`role to ${data.role}`);
      if (data.capacity && data.capacity !== existingUser.capacity) changes.push(`capacity to ${data.capacity}`);

      await ActivityLogsService.create({
        userId: sessionData?.actorUserId ?? undefined,
        userName: actorUserName,
        userEmail: sessionData?.actorUserEmail ?? undefined,
        action: 'UPDATE',
        entity: 'USER',
        entityId: user.id,
        description: `Updated user: ${user.name}${changes.length > 0 ? ` (${changes.join(', ')})` : ''}`,
        metadata: {
          changes: data,
          targetUser: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Update user status
   */
  static async updateStatus(id: string, data: UpdateUserStatusDTO, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          status: data.status,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          avatar: true,
          capacity: true,
          skills: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      logger.info(`User status updated: ${id} to ${data.status}`);

      // Get actor user info for activity log
      let actorUserName = 'System';
      if (sessionData?.actorUserId) {
        const actorUser = await prisma.user.findUnique({
          where: { id: sessionData.actorUserId },
          select: { name: true },
        });
        if (actorUser) {
          actorUserName = actorUser.name;
        }
      }

      // Log activity
      await ActivityLogsService.create({
        userId: sessionData?.actorUserId ?? undefined,
        userName: actorUserName,
        userEmail: sessionData?.actorUserEmail ?? undefined,
        action: 'STATUS_CHANGE',
        entity: 'USER',
        entityId: updatedUser.id,
        description: `Changed status of user ${updatedUser.name} from ${user.status} to ${data.status}`,
        metadata: {
          oldStatus: user.status,
          newStatus: data.status,
          targetUser: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
          },
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return updatedUser;
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(id: string, newPassword: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Hash new password
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });

      logger.info(`Password updated for user: ${id}`);
    } catch (error) {
      logger.error('Error updating password:', error);
      throw error;
    }
  }

  /**
   * Delete user (soft delete)
   */
  static async delete(id: string, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          assignedRequests: {
            select: {
              id: true,
              status: true,
            },
          },
          assignments: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if user has active assignments
      const activeAssignments = user.assignedRequests.filter((r) =>
        ['IN_PROGRESS', 'REVIEW', 'BACKLOG', 'INTAKE'].includes(r.status)
      );

      if (activeAssignments.length > 0) {
        throw new AppError(
          `Cannot delete user with ${activeAssignments.length} active assignments. Please reassign them first.`,
          400
        );
      }

      // Soft delete: set status to INACTIVE
      await prisma.user.update({
        where: { id },
        data: {
          status: 'INACTIVE',
        },
      });

      logger.info(`User soft deleted: ${id}`);

      // Get actor user info for activity log
      let actorUserName = 'System';
      if (sessionData?.actorUserId) {
        const actorUser = await prisma.user.findUnique({
          where: { id: sessionData.actorUserId },
          select: { name: true },
        });
        if (actorUser) {
          actorUserName = actorUser.name;
        }
      }

      // Log activity
      await ActivityLogsService.create({
        userId: sessionData?.actorUserId ?? undefined,
        userName: actorUserName,
        userEmail: sessionData?.actorUserEmail ?? undefined,
        action: 'DELETE',
        entity: 'USER',
        entityId: user.id,
        description: `Deactivated user: ${user.name} (${user.email})`,
        metadata: {
          previousStatus: user.status,
          targetUser: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}
