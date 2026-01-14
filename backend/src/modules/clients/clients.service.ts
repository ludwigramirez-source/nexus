import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type {
  CreateClientDTO,
  UpdateClientDTO,
  UpdateHealthScoreDTO,
  ClientFilters,
  ClientResponse,
} from './clients.types';

export class ClientsService {
  /**
   * Get all clients with filters
   */
  static async getAll(filters: ClientFilters) {
    try {
      const { search, page = 1, limit = 20 } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { contactPerson: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await prisma.client.count({ where });

      // Get clients
      const clients = await prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return {
        clients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting clients:', error);
      throw error;
    }
  }

  /**
   * Get client by ID
   */
  static async getById(id: string): Promise<ClientResponse> {
    try {
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      if (!client) {
        throw new AppError('Client not found', 404);
      }

      return client;
    } catch (error) {
      logger.error('Error getting client by ID:', error);
      throw error;
    }
  }

  /**
   * Create new client
   */
  static async create(data: CreateClientDTO, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<ClientResponse> {
    try {
      // Check if client with same name exists
      const existingClient = await prisma.client.findFirst({
        where: { name: data.name },
      });

      if (existingClient) {
        throw new AppError('Client with this name already exists', 409);
      }

      const client = await prisma.client.create({
        data: {
          name: data.name,
          nit: data.nit,
          email: data.email,
          contactPerson: data.contactPerson,
          phone: data.phone,
          website: data.website,
          address: data.address,
          city: data.city,
          notes: data.notes,
          products: data.products || [],
          mrr: data.mrr || 0,
          currency: data.currency || 'USD',
          healthScore: data.healthScore || 80,
          tier: data.tier || 'BASIC',
        },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      logger.info(`Client created: ${client.id}`);

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
        action: 'CREATE',
        entity: 'CLIENT',
        entityId: client.id,
        description: `Created client "${client.name}"`,
        metadata: {
          clientName: client.name,
          email: client.email,
          contactPerson: client.contactPerson,
          tier: client.tier,
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return client;
    } catch (error) {
      logger.error('Error creating client:', error);
      throw error;
    }
  }

  /**
   * Update client
   */
  static async update(id: string, data: UpdateClientDTO, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<ClientResponse> {
    try {
      const existingClient = await prisma.client.findUnique({
        where: { id },
      });

      if (!existingClient) {
        throw new AppError('Client not found', 404);
      }

      // Check if name is being changed and if it's already taken
      if (data.name && data.name !== existingClient.name) {
        const nameTaken = await prisma.client.findFirst({
          where: { name: data.name },
        });

        if (nameTaken) {
          throw new AppError('Client with this name already exists', 409);
        }
      }

      const client = await prisma.client.update({
        where: { id },
        data: {
          name: data.name,
          nit: data.nit,
          email: data.email,
          contactPerson: data.contactPerson,
          phone: data.phone,
          website: data.website,
          address: data.address,
          city: data.city,
          notes: data.notes,
          products: data.products,
          mrr: data.mrr,
          currency: data.currency,
          healthScore: data.healthScore,
          tier: data.tier,
          status: data.status,
        },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      logger.info(`Client updated: ${id}`);

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

      // Identify what changed
      const changes: any = {};
      if (data.name !== undefined && data.name !== existingClient.name) {
        changes.name = { old: existingClient.name, new: data.name };
      }
      if (data.email !== undefined && data.email !== existingClient.email) {
        changes.email = { old: existingClient.email, new: data.email };
      }
      if (data.contactPerson !== undefined && data.contactPerson !== existingClient.contactPerson) {
        changes.contactPerson = { old: existingClient.contactPerson, new: data.contactPerson };
      }
      if (data.phone !== undefined && data.phone !== existingClient.phone) {
        changes.phone = { old: existingClient.phone, new: data.phone };
      }
      if (data.website !== undefined && data.website !== existingClient.website) {
        changes.website = { old: existingClient.website, new: data.website };
      }
      if (data.address !== undefined && data.address !== existingClient.address) {
        changes.address = { old: existingClient.address, new: data.address };
      }
      if (data.city !== undefined && data.city !== existingClient.city) {
        changes.city = { old: existingClient.city, new: data.city };
      }
      if (data.nit !== undefined && data.nit !== existingClient.nit) {
        changes.nit = { old: existingClient.nit, new: data.nit };
      }
      if (data.tier !== undefined && data.tier !== existingClient.tier) {
        changes.tier = { old: existingClient.tier, new: data.tier };
      }
      if (data.status !== undefined && data.status !== existingClient.status) {
        changes.status = { old: existingClient.status, new: data.status };
      }
      if (data.mrr !== undefined && data.mrr !== existingClient.mrr) {
        changes.mrr = { old: existingClient.mrr, new: data.mrr };
      }
      if (data.currency !== undefined && data.currency !== existingClient.currency) {
        changes.currency = { old: existingClient.currency, new: data.currency };
      }
      if (data.healthScore !== undefined && data.healthScore !== existingClient.healthScore) {
        changes.healthScore = { old: existingClient.healthScore, new: data.healthScore };
      }
      if (data.notes !== undefined && data.notes !== existingClient.notes) {
        changes.notes = { old: existingClient.notes || '', new: data.notes || '' };
      }
      if (data.products !== undefined && JSON.stringify(data.products) !== JSON.stringify(existingClient.products)) {
        changes.products = { old: existingClient.products, new: data.products };
      }

      // Log activity
      await ActivityLogsService.create({
        userId: sessionData?.actorUserId ?? undefined,
        userName: actorUserName,
        userEmail: sessionData?.actorUserEmail ?? undefined,
        action: 'UPDATE',
        entity: 'CLIENT',
        entityId: client.id,
        description: `Updated client "${client.name}"`,
        metadata: {
          clientName: client.name,
          changes,
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return client;
    } catch (error) {
      logger.error('Error updating client:', error);
      throw error;
    }
  }

  /**
   * Delete client
   */
  static async delete(id: string, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<void> {
    try {
      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      if (!client) {
        throw new AppError('Client not found', 404);
      }

      // Check if client has associated requests
      if (client._count.requests > 0) {
        throw new AppError(
          `Cannot delete client with ${client._count.requests} associated requests. Please reassign them first.`,
          400
        );
      }

      // Store client name before deletion
      const clientName = client.name;

      await prisma.client.delete({
        where: { id },
      });

      logger.info(`Client deleted: ${id}`);

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
        entity: 'CLIENT',
        entityId: id,
        description: `Deleted client "${clientName}"`,
        metadata: {
          clientName,
          email: client.email,
          tier: client.tier,
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });
    } catch (error) {
      logger.error('Error deleting client:', error);
      throw error;
    }
  }

  /**
   * Get client requests
   */
  static async getRequests(clientId: string) {
    try {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        throw new AppError('Client not found', 404);
      }

      const requests = await prisma.request.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: {
          assignedUsers: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return requests;
    } catch (error) {
      logger.error('Error getting client requests:', error);
      throw error;
    }
  }

  /**
   * Update health score
   */
  static async updateHealthScore(id: string, data: UpdateHealthScoreDTO): Promise<ClientResponse> {
    try {
      const client = await prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        throw new AppError('Client not found', 404);
      }

      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          healthScore: data.healthScore,
        },
        include: {
          _count: {
            select: {
              requests: true,
            },
          },
        },
      });

      logger.info(`Client health score updated: ${id} to ${data.healthScore}`);

      return updatedClient;
    } catch (error) {
      logger.error('Error updating client health score:', error);
      throw error;
    }
  }
}
