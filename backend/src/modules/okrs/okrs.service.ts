import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import type {
  CreateOKRDTO,
  UpdateOKRDTO,
  UpdateOKRStatusDTO,
  CreateKeyResultDTO,
  UpdateKeyResultDTO,
  UpdateKeyResultProgressDTO,
  OKRFilters,
  OKRResponse,
  KeyResultResponse,
} from './okrs.types';

export class OKRsService {
  /**
   * Get all OKRs with filters
   */
  static async getAll(filters: OKRFilters) {
    try {
      const { quarter, year, status, ownerId, page = 1, limit = 20 } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (quarter) where.quarter = quarter;
      if (year) where.year = year;
      if (status) where.status = status;
      if (ownerId) where.ownerId = ownerId;

      // Get total count
      const total = await prisma.oKR.count({ where });

      // Get OKRs
      const okrs = await prisma.oKR.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ year: 'desc' }, { quarter: 'desc' }],
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          keyResults: true,
        },
      });

      // Format response with calculated progress
      const formattedOKRs = okrs.map(this.formatOKRResponse);

      return {
        okrs: formattedOKRs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting OKRs:', error);
      throw error;
    }
  }

  /**
   * Get OKR by ID
   */
  static async getById(id: string): Promise<OKRResponse> {
    try {
      const okr = await prisma.oKR.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          keyResults: true,
        },
      });

      if (!okr) {
        throw new AppError('OKR not found', 404);
      }

      return this.formatOKRResponse(okr);
    } catch (error) {
      logger.error('Error getting OKR by ID:', error);
      throw error;
    }
  }

  /**
   * Create new OKR
   */
  static async create(data: CreateOKRDTO): Promise<OKRResponse> {
    try {
      // Verify owner exists
      const owner = await prisma.user.findUnique({
        where: { id: data.ownerId },
      });

      if (!owner) {
        throw new AppError('Owner not found', 404);
      }

      const okr = await prisma.oKR.create({
        data: {
          title: data.title,
          description: data.description,
          quarter: data.quarter,
          year: data.year,
          ownerId: data.ownerId,
          status: 'NOT_STARTED',
          progress: 0,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          keyResults: true,
        },
      });

      logger.info(`OKR created: ${okr.id}`);

      return this.formatOKRResponse(okr);
    } catch (error) {
      logger.error('Error creating OKR:', error);
      throw error;
    }
  }

  /**
   * Update OKR
   */
  static async update(id: string, data: UpdateOKRDTO): Promise<OKRResponse> {
    try {
      const existingOKR = await prisma.oKR.findUnique({
        where: { id },
      });

      if (!existingOKR) {
        throw new AppError('OKR not found', 404);
      }

      // Verify owner exists if being updated
      if (data.ownerId) {
        const owner = await prisma.user.findUnique({
          where: { id: data.ownerId },
        });

        if (!owner) {
          throw new AppError('Owner not found', 404);
        }
      }

      const okr = await prisma.oKR.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          quarter: data.quarter,
          year: data.year,
          ownerId: data.ownerId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          keyResults: true,
        },
      });

      logger.info(`OKR updated: ${id}`);

      return this.formatOKRResponse(okr);
    } catch (error) {
      logger.error('Error updating OKR:', error);
      throw error;
    }
  }

  /**
   * Delete OKR
   */
  static async delete(id: string): Promise<void> {
    try {
      const okr = await prisma.oKR.findUnique({
        where: { id },
      });

      if (!okr) {
        throw new AppError('OKR not found', 404);
      }

      await prisma.oKR.delete({
        where: { id },
      });

      logger.info(`OKR deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting OKR:', error);
      throw error;
    }
  }

  /**
   * Update OKR status
   */
  static async updateStatus(id: string, data: UpdateOKRStatusDTO): Promise<OKRResponse> {
    try {
      const okr = await prisma.oKR.findUnique({
        where: { id },
      });

      if (!okr) {
        throw new AppError('OKR not found', 404);
      }

      const updatedOKR = await prisma.oKR.update({
        where: { id },
        data: {
          status: data.status,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          keyResults: true,
        },
      });

      logger.info(`OKR status updated: ${id} to ${data.status}`);

      return this.formatOKRResponse(updatedOKR);
    } catch (error) {
      logger.error('Error updating OKR status:', error);
      throw error;
    }
  }

  /**
   * Create key result
   */
  static async createKeyResult(okrId: string, data: CreateKeyResultDTO): Promise<KeyResultResponse> {
    try {
      const okr = await prisma.oKR.findUnique({
        where: { id: okrId },
      });

      if (!okr) {
        throw new AppError('OKR not found', 404);
      }

      const keyResult = await prisma.keyResult.create({
        data: {
          okrId,
          title: data.title,
          targetValue: data.targetValue,
          currentValue: data.currentValue || 0,
          unit: data.unit,
        },
      });

      // Update OKR progress
      await this.updateOKRProgress(okrId);

      logger.info(`Key result created for OKR: ${okrId}`);

      return this.formatKeyResultResponse(keyResult);
    } catch (error) {
      logger.error('Error creating key result:', error);
      throw error;
    }
  }

  /**
   * Update key result
   */
  static async updateKeyResult(okrId: string, krId: string, data: UpdateKeyResultDTO): Promise<KeyResultResponse> {
    try {
      const keyResult = await prisma.keyResult.findUnique({
        where: { id: krId },
      });

      if (!keyResult || keyResult.okrId !== okrId) {
        throw new AppError('Key result not found', 404);
      }

      const updatedKR = await prisma.keyResult.update({
        where: { id: krId },
        data: {
          title: data.title,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          unit: data.unit,
        },
      });

      // Update OKR progress
      await this.updateOKRProgress(okrId);

      logger.info(`Key result updated: ${krId}`);

      return this.formatKeyResultResponse(updatedKR);
    } catch (error) {
      logger.error('Error updating key result:', error);
      throw error;
    }
  }

  /**
   * Delete key result
   */
  static async deleteKeyResult(okrId: string, krId: string): Promise<void> {
    try {
      const keyResult = await prisma.keyResult.findUnique({
        where: { id: krId },
      });

      if (!keyResult || keyResult.okrId !== okrId) {
        throw new AppError('Key result not found', 404);
      }

      await prisma.keyResult.delete({
        where: { id: krId },
      });

      // Update OKR progress
      await this.updateOKRProgress(okrId);

      logger.info(`Key result deleted: ${krId}`);
    } catch (error) {
      logger.error('Error deleting key result:', error);
      throw error;
    }
  }

  /**
   * Update key result progress
   */
  static async updateKeyResultProgress(
    okrId: string,
    krId: string,
    data: UpdateKeyResultProgressDTO
  ): Promise<KeyResultResponse> {
    try {
      const keyResult = await prisma.keyResult.findUnique({
        where: { id: krId },
      });

      if (!keyResult || keyResult.okrId !== okrId) {
        throw new AppError('Key result not found', 404);
      }

      const updatedKR = await prisma.keyResult.update({
        where: { id: krId },
        data: {
          currentValue: data.currentValue,
        },
      });

      // Update OKR progress
      await this.updateOKRProgress(okrId);

      logger.info(`Key result progress updated: ${krId}`);

      return this.formatKeyResultResponse(updatedKR);
    } catch (error) {
      logger.error('Error updating key result progress:', error);
      throw error;
    }
  }

  /**
   * Update OKR progress based on key results
   */
  private static async updateOKRProgress(okrId: string): Promise<void> {
    const keyResults = await prisma.keyResult.findMany({
      where: { okrId },
    });

    if (keyResults.length === 0) {
      await prisma.oKR.update({
        where: { id: okrId },
        data: { progress: 0 },
      });
      return;
    }

    const totalProgress = keyResults.reduce((sum, kr) => {
      const krProgress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0;
      return sum + Math.min(krProgress, 100);
    }, 0);

    const averageProgress = totalProgress / keyResults.length;

    await prisma.oKR.update({
      where: { id: okrId },
      data: { progress: Math.round(averageProgress * 100) / 100 },
    });
  }

  /**
   * Format OKR response
   */
  private static formatOKRResponse(okr: any): OKRResponse {
    return {
      id: okr.id,
      title: okr.title,
      description: okr.description,
      quarter: okr.quarter,
      year: okr.year,
      status: okr.status,
      progress: okr.progress,
      createdAt: okr.createdAt,
      updatedAt: okr.updatedAt,
      owner: okr.owner,
      keyResults: okr.keyResults?.map(this.formatKeyResultResponse),
    };
  }

  /**
   * Format key result response
   */
  private static formatKeyResultResponse(kr: any): KeyResultResponse {
    const progress = kr.targetValue > 0 ? Math.min((kr.currentValue / kr.targetValue) * 100, 100) : 0;

    return {
      id: kr.id,
      title: kr.title,
      targetValue: kr.targetValue,
      currentValue: kr.currentValue,
      unit: kr.unit,
      progress: Math.round(progress * 100) / 100,
      createdAt: kr.createdAt,
      updatedAt: kr.updatedAt,
    };
  }
}
