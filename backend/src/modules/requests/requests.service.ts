import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import { sendRequestStatusNotification, sendRequestAssignmentNotification } from '../../utils/email.service';
import type {
  CreateRequestDTO,
  UpdateRequestDTO,
  ChangeStatusDTO,
  AssignUsersDTO,
  CreateActivityDTO,
  CreateCommentDTO,
  RequestFilters,
  RequestResponse,
  ActivityResponse,
  CommentResponse,
} from './requests.types';

/**
 * Generate request number: REQ-{consecutive}
 * Format: REQ-1001, REQ-1002, etc.
 */
async function generateRequestNumber(): Promise<string> {
  // Get the last request
  const lastRequest = await prisma.request.findFirst({
    where: {
      requestNumber: {
        startsWith: 'REQ-'
      }
    },
    orderBy: {
      requestNumber: 'desc'
    }
  });

  let consecutive = 1001;

  if (lastRequest && lastRequest.requestNumber) {
    // Extract consecutive number from last request
    const parts = lastRequest.requestNumber.split('-');
    if (parts.length === 2) {
      const lastConsecutive = parseInt(parts[1], 10);
      if (!isNaN(lastConsecutive)) {
        consecutive = lastConsecutive + 1;
      }
    }
  }

  // Format: REQ-1001
  const requestNumber = `REQ-${consecutive}`;
  return requestNumber;
}

export class RequestsService {
  /**
   * Get all requests with filters and pagination
   */
  static async getAll(filters: RequestFilters, userId: string) {
    try {
      const {
        status,
        type,
        priority,
        productId,
        assignedTo,
        clientId,
        search,
        dateFrom,
        dateTo,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (status) where.status = status;
      if (type) where.type = type;
      if (priority) where.priority = priority;
      if (productId) where.productId = productId;
      if (clientId) where.clientId = clientId;

      if (assignedTo) {
        where.assignedUsers = {
          some: {
            userId: assignedTo,
          },
        };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ];
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }

      // Get total count
      const total = await prisma.request.count({ where });

      // Get requests
      const requests = await prisma.request.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
              comments: true,
            },
          },
        },
      });

      // Format response
      const formattedRequests = requests.map(this.formatRequestResponse);

      return {
        requests: formattedRequests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting requests:', error);
      throw error;
    }
  }

  /**
   * Get request by ID
   */
  static async getById(id: string): Promise<RequestResponse> {
    try {
      const request = await prisma.request.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
              comments: true,
            },
          },
        },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      return this.formatRequestResponse(request);
    } catch (error) {
      logger.error('Error getting request by ID:', error);
      throw error;
    }
  }

  /**
   * Create new request
   */
  static async create(data: CreateRequestDTO, userId: string): Promise<RequestResponse> {
    try {
      // Generate auto-numeric request number
      const requestNumber = await generateRequestNumber();

      const request = await prisma.request.create({
        data: {
          requestNumber,
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority,
          estimatedHours: data.estimatedHours,
          productId: data.productId,
          clientId: data.clientId,
          tags: data.tags || [],
          requestedBy: userId,
          status: 'INTAKE',
          assignedUsers: data.assignedUserIds
            ? {
                connect: data.assignedUserIds.map((userId) => ({ id: userId })),
              }
            : undefined,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
              comments: true,
            },
          },
        },
      });

      // Create activity
      await prisma.requestActivity.create({
        data: {
          requestId: request.id,
          userId,
          activityType: 'CREATED',
          description: 'Request created',
        },
      });

      // Emit Socket.io event (will be implemented in server.ts)
      try {
        const { io } = await import('../../server');
        io.emit('request:created', this.formatRequestResponse(request));
      } catch (error) {
        logger.warn('Socket.io not available yet');
      }

      // Send email notification to assigned users
      if (data.assignedUserIds && data.assignedUserIds.length > 0) {
        const assignedUsers = await prisma.user.findMany({
          where: { id: { in: data.assignedUserIds } },
        });
        await sendRequestAssignmentNotification(request, assignedUsers, userId);
      }

      logger.info(`Request created: ${request.id}`);

      return this.formatRequestResponse(request);
    } catch (error) {
      logger.error('Error creating request:', error);
      throw error;
    }
  }

  /**
   * Update request
   */
  static async update(id: string, data: UpdateRequestDTO, userId: string): Promise<RequestResponse> {
    try {
      const existingRequest = await prisma.request.findUnique({
        where: { id },
      });

      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }

      const request = await prisma.request.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority,
          estimatedHours: data.estimatedHours,
          actualHours: data.actualHours,
          productId: data.productId,
          clientId: data.clientId,
          tags: data.tags,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
              comments: true,
            },
          },
        },
      });

      // Create activity
      await prisma.requestActivity.create({
        data: {
          requestId: id,
          userId,
          activityType: 'UPDATED',
          description: 'Request updated',
          metadata: data,
        },
      });

      // Emit Socket.io event
      try {
        const { io } = await import('../../server');
        io.to(`request:${id}`).emit('request:updated', this.formatRequestResponse(request));
      } catch (error) {
        logger.warn('Socket.io not available yet');
      }

      logger.info(`Request updated: ${id}`);

      return this.formatRequestResponse(request);
    } catch (error) {
      logger.error('Error updating request:', error);
      throw error;
    }
  }

  /**
   * Delete request
   * Business rule: Cannot delete requests with assigned users
   */
  static async delete(id: string): Promise<void> {
    try {
      const request = await prisma.request.findUnique({
        where: { id },
        include: {
          assignedUsers: true,
        },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Business rule: Cannot delete if has assigned users
      if (request.assignedUsers && request.assignedUsers.length > 0) {
        throw new AppError('Cannot delete a request with assigned users. Please unassign all users first.', 400);
      }

      await prisma.request.delete({
        where: { id },
      });

      logger.info(`Request deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting request:', error);
      throw error;
    }
  }

  /**
   * Change request status
   */
  static async changeStatus(id: string, data: ChangeStatusDTO, userId: string): Promise<RequestResponse> {
    try {
      const existingRequest = await prisma.request.findUnique({
        where: { id },
        include: {
          assignedUsers: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!existingRequest) {
        throw new AppError('Request not found', 404);
      }

      const oldStatus = existingRequest.status;

      const request = await prisma.request.update({
        where: { id },
        data: {
          status: data.status,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
              comments: true,
            },
          },
        },
      });

      // Create activity
      await prisma.requestActivity.create({
        data: {
          requestId: id,
          userId,
          activityType: 'STATUS_CHANGED',
          description: `Status changed from ${oldStatus} to ${data.status}`,
          metadata: {
            oldStatus,
            newStatus: data.status,
            comment: data.comment,
          },
        },
      });

      // Emit Socket.io event
      try {
        const { io } = await import('../../server');
        io.to(`request:${id}`).emit('request:status_changed', {
          requestId: id,
          oldStatus,
          newStatus: data.status,
        });
      } catch (error) {
        logger.warn('Socket.io not available yet');
      }

      // Send email notification
      const assignedUsers = existingRequest.assignedUsers.map((a) => a.user);
      await sendRequestStatusNotification(request, assignedUsers, userId);

      logger.info(`Request status changed: ${id} from ${oldStatus} to ${data.status}`);

      return this.formatRequestResponse(request);
    } catch (error) {
      logger.error('Error changing request status:', error);
      throw error;
    }
  }

  /**
   * Assign users to request
   */
  static async assignUsers(id: string, data: AssignUsersDTO, userId: string): Promise<RequestResponse> {
    try {
      const request = await prisma.request.findUnique({
        where: { id },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Delete existing assignments
      await prisma.assignment.deleteMany({
        where: { requestId: id },
      });

      // Create new assignments
      await prisma.assignment.createMany({
        data: data.userIds.map((userId) => ({
          requestId: id,
          userId,
        })),
      });

      const updatedRequest = await prisma.request.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUsers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              activities: true,
              comments: true,
            },
          },
        },
      });

      // Create activity
      await prisma.requestActivity.create({
        data: {
          requestId: id,
          userId,
          activityType: 'ASSIGNED',
          description: `Users assigned to request`,
          metadata: { userIds: data.userIds },
        },
      });

      // Send email notification to assigned users
      const assignedUsers = await prisma.user.findMany({
        where: { id: { in: data.userIds } },
      });
      await sendRequestAssignmentNotification(request, assignedUsers, userId);

      logger.info(`Users assigned to request: ${id}`);

      return this.formatRequestResponse(updatedRequest!);
    } catch (error) {
      logger.error('Error assigning users to request:', error);
      throw error;
    }
  }

  /**
   * Get request activities
   */
  static async getActivities(requestId: string): Promise<ActivityResponse[]> {
    try {
      const activities = await prisma.requestActivity.findMany({
        where: { requestId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return activities.map(activity => ({
        ...activity,
        type: activity.activityType,
      }));
    } catch (error) {
      logger.error('Error getting request activities:', error);
      throw error;
    }
  }

  /**
   * Create request activity
   */
  static async createActivity(requestId: string, data: CreateActivityDTO, userId: string): Promise<ActivityResponse> {
    try {
      const request = await prisma.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      const activity = await prisma.requestActivity.create({
        data: {
          requestId,
          userId,
          activityType: data.type,
          description: data.description,
          metadata: data.metadata,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Activity created for request: ${requestId}`);

      return {
        ...activity,
        type: activity.activityType,
      };
    } catch (error) {
      logger.error('Error creating request activity:', error);
      throw error;
    }
  }

  /**
   * Get request comments
   */
  static async getComments(requestId: string): Promise<CommentResponse[]> {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          requestId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return comments;
    } catch (error) {
      logger.error('Error getting request comments:', error);
      throw error;
    }
  }

  /**
   * Create request comment
   */
  static async createComment(requestId: string, data: CreateCommentDTO, userId: string): Promise<CommentResponse> {
    try {
      const request = await prisma.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      const comment = await prisma.comment.create({
        data: {
          requestId,
          userId,
          content: data.content,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create activity
      await prisma.requestActivity.create({
        data: {
          requestId,
          userId,
          activityType: 'COMMENT_ADDED',
          description: 'Comment added',
        },
      });

      logger.info(`Comment created for request: ${requestId}`);

      return comment;
    } catch (error) {
      logger.error('Error creating request comment:', error);
      throw error;
    }
  }

  /**
   * Format request response
   */
  private static formatRequestResponse(request: any): RequestResponse {
    return {
      id: request.id,
      requestNumber: request.requestNumber,
      title: request.title,
      description: request.description,
      type: request.type,
      status: request.status,
      priority: request.priority,
      estimatedHours: request.estimatedHours,
      actualHours: request.actualHours,
      productId: request.productId,
      tags: request.tags,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      createdBy: { id: request.requestedBy, name: 'Unknown', email: 'Unknown@example.com' },
      product: request.product,
      client: request.client,
      assignedUsers: request.assignedUsers,
      _count: request._count,
    };
  }
}
