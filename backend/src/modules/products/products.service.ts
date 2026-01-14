import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type {
  CreateProductDTO,
  UpdateProductDTO,
  CreateRoadmapItemDTO,
  UpdateRoadmapItemDTO,
  ProductResponse,
  RoadmapItemResponse,
} from './products.types';

export class ProductsService {
  /**
   * Get all products
   */
  static async getAll(): Promise<ProductResponse[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              roadmapItems: true,
            },
          },
        },
      });

      return products;
    } catch (error) {
      logger.error('Error getting products:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  static async getById(id: string): Promise<ProductResponse> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          roadmapItems: {
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              roadmapItems: true,
            },
          },
        },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return product;
    } catch (error) {
      logger.error('Error getting product by ID:', error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  static async create(data: CreateProductDTO, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<ProductResponse> {
    try {
      // Check if product with same name exists
      const existingProduct = await prisma.product.findUnique({
        where: { name: data.name },
      });

      if (existingProduct) {
        throw new AppError('Product with this name already exists', 409);
      }

      const product = await prisma.product.create({
        data: {
          name: data.name,
          type: data.type || 'PRODUCT',
          description: data.description,
          price: data.price || 0,
          currency: data.currency || 'USD',
          hasVAT: data.hasVAT ?? true,
          vatRate: data.vatRate || 19,
          recurrence: data.recurrence || 'MONTHLY',
          repositoryUrl: data.repositoryUrl,
          productionUrl: data.productionUrl,
          stagingUrl: data.stagingUrl,
          status: 'ACTIVE',
        },
        include: {
          _count: {
            select: {
              roadmapItems: true,
            },
          },
        },
      });

      logger.info(`Product created: ${product.id}`);

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
        entity: 'PRODUCT',
        entityId: product.id,
        description: `Created product "${product.name}"`,
        metadata: {
          productName: product.name,
          status: product.status,
          repositoryUrl: product.repositoryUrl,
          productionUrl: product.productionUrl,
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  static async update(id: string, data: UpdateProductDTO, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<ProductResponse> {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        throw new AppError('Product not found', 404);
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          type: data.type,
          description: data.description,
          price: data.price,
          currency: data.currency,
          hasVAT: data.hasVAT,
          vatRate: data.vatRate,
          recurrence: data.recurrence,
          repositoryUrl: data.repositoryUrl,
          productionUrl: data.productionUrl,
          stagingUrl: data.stagingUrl,
          status: data.status,
        },
        include: {
          _count: {
            select: {
              roadmapItems: true,
            },
          },
        },
      });

      logger.info(`Product updated: ${id}`);

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
      if (data.type !== undefined && data.type !== existingProduct.type) {
        changes.type = { old: existingProduct.type, new: data.type };
      }
      if (data.description !== undefined && data.description !== existingProduct.description) {
        changes.description = { old: existingProduct.description, new: data.description };
      }
      if (data.price !== undefined && data.price !== existingProduct.price) {
        changes.price = { old: existingProduct.price, new: data.price };
      }
      if (data.currency !== undefined && data.currency !== existingProduct.currency) {
        changes.currency = { old: existingProduct.currency, new: data.currency };
      }
      if (data.hasVAT !== undefined && data.hasVAT !== existingProduct.hasVAT) {
        changes.hasVAT = { old: existingProduct.hasVAT, new: data.hasVAT };
      }
      if (data.vatRate !== undefined && data.vatRate !== existingProduct.vatRate) {
        changes.vatRate = { old: existingProduct.vatRate, new: data.vatRate };
      }
      if (data.recurrence !== undefined && data.recurrence !== existingProduct.recurrence) {
        changes.recurrence = { old: existingProduct.recurrence, new: data.recurrence };
      }
      if (data.repositoryUrl !== undefined && data.repositoryUrl !== existingProduct.repositoryUrl) {
        changes.repositoryUrl = { old: existingProduct.repositoryUrl, new: data.repositoryUrl };
      }
      if (data.productionUrl !== undefined && data.productionUrl !== existingProduct.productionUrl) {
        changes.productionUrl = { old: existingProduct.productionUrl, new: data.productionUrl };
      }
      if (data.stagingUrl !== undefined && data.stagingUrl !== existingProduct.stagingUrl) {
        changes.stagingUrl = { old: existingProduct.stagingUrl, new: data.stagingUrl };
      }
      if (data.status !== undefined && data.status !== existingProduct.status) {
        changes.status = { old: existingProduct.status, new: data.status };
      }

      // Log activity
      await ActivityLogsService.create({
        userId: sessionData?.actorUserId ?? undefined,
        userName: actorUserName,
        userEmail: sessionData?.actorUserEmail ?? undefined,
        action: 'UPDATE',
        entity: 'PRODUCT',
        entityId: product.id,
        description: `Updated product "${product.name}"`,
        metadata: {
          productName: product.name,
          changes,
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return product;
    } catch (error) {
      logger.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  static async delete(id: string, sessionData?: { ipAddress?: string; userAgent?: string; actorUserId?: string; actorUserEmail?: string }): Promise<void> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Store product name before deletion
      const productName = product.name;

      await prisma.product.delete({
        where: { id },
      });

      logger.info(`Product deleted: ${id}`);

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
        entity: 'PRODUCT',
        entityId: id,
        description: `Deleted product "${productName}"`,
        metadata: {
          productName,
          status: product.status,
        },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Get product roadmap
   */
  static async getRoadmap(productId: string): Promise<RoadmapItemResponse[]> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const roadmapItems = await prisma.roadmapItem.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
      });

      return roadmapItems;
    } catch (error) {
      logger.error('Error getting product roadmap:', error);
      throw error;
    }
  }

  /**
   * Create roadmap item
   */
  static async createRoadmapItem(productId: string, data: CreateRoadmapItemDTO): Promise<RoadmapItemResponse> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const roadmapItem = await prisma.roadmapItem.create({
        data: {
          productId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          targetQuarter: data.targetQuarter,
          estimatedHours: data.estimatedHours,
          status: 'PLANNED',
        },
      });

      logger.info(`Roadmap item created for product: ${productId}`);

      return roadmapItem;
    } catch (error) {
      logger.error('Error creating roadmap item:', error);
      throw error;
    }
  }

  /**
   * Update roadmap item
   */
  static async updateRoadmapItem(
    productId: string,
    itemId: string,
    data: UpdateRoadmapItemDTO
  ): Promise<RoadmapItemResponse> {
    try {
      const roadmapItem = await prisma.roadmapItem.findUnique({
        where: { id: itemId },
      });

      if (!roadmapItem || roadmapItem.productId !== productId) {
        throw new AppError('Roadmap item not found', 404);
      }

      const updatedItem = await prisma.roadmapItem.update({
        where: { id: itemId },
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          targetQuarter: data.targetQuarter,
          estimatedHours: data.estimatedHours,
          completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
        },
      });

      logger.info(`Roadmap item updated: ${itemId}`);

      return updatedItem;
    } catch (error) {
      logger.error('Error updating roadmap item:', error);
      throw error;
    }
  }

  /**
   * Delete roadmap item
   */
  static async deleteRoadmapItem(productId: string, itemId: string): Promise<void> {
    try {
      const roadmapItem = await prisma.roadmapItem.findUnique({
        where: { id: itemId },
      });

      if (!roadmapItem || roadmapItem.productId !== productId) {
        throw new AppError('Roadmap item not found', 404);
      }

      await prisma.roadmapItem.delete({
        where: { id: itemId },
      });

      logger.info(`Roadmap item deleted: ${itemId}`);
    } catch (error) {
      logger.error('Error deleting roadmap item:', error);
      throw error;
    }
  }
}
