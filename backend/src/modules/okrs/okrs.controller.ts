import type { Request, Response, NextFunction } from 'express';
import { OKRsService } from './okrs.service';
import {
  createOKRSchema,
  updateOKRSchema,
  updateOKRStatusSchema,
  createKeyResultSchema,
  updateKeyResultSchema,
  updateKeyResultProgressSchema,
  okrFiltersSchema,
} from './okrs.types';
import { successResponse, paginatedResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import logger from '../../config/logger';

export class OKRsController {
  /**
   * Get all OKRs with filters
   * GET /api/okrs
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = validateRequest(okrFiltersSchema, {
        ...req.query,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      const result = await OKRsService.getAll(filters);

      paginatedResponse(res, result.okrs, result.pagination.page, result.pagination.limit, result.pagination.total);
    } catch (error) {
      logger.error('Get OKRs error:', error);
      next(error);
    }
  }

  /**
   * Get OKR by ID
   * GET /api/okrs/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const okr = await OKRsService.getById(id);
      successResponse(res, okr, 'OKR retrieved successfully', 200);
    } catch (error) {
      logger.error('Get OKR by ID error:', error);
      next(error);
    }
  }

  /**
   * Create new OKR
   * POST /api/okrs
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(createOKRSchema, req.body);
      const okr = await OKRsService.create(validatedData);
      successResponse(res, okr, 'OKR created successfully', 201);
    } catch (error) {
      logger.error('Create OKR error:', error);
      next(error);
    }
  }

  /**
   * Update OKR
   * PUT /api/okrs/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateOKRSchema, req.body);
      const okr = await OKRsService.update(id, validatedData);
      successResponse(res, okr, 'OKR updated successfully', 200);
    } catch (error) {
      logger.error('Update OKR error:', error);
      next(error);
    }
  }

  /**
   * Delete OKR
   * DELETE /api/okrs/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await OKRsService.delete(id);
      successResponse(res, null, 'OKR deleted successfully', 200);
    } catch (error) {
      logger.error('Delete OKR error:', error);
      next(error);
    }
  }

  /**
   * Update OKR status
   * PATCH /api/okrs/:id/status
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateOKRStatusSchema, req.body);
      const okr = await OKRsService.updateStatus(id, validatedData);
      successResponse(res, okr, 'OKR status updated successfully', 200);
    } catch (error) {
      logger.error('Update OKR status error:', error);
      next(error);
    }
  }

  /**
   * Create key result
   * POST /api/okrs/:id/key-results
   */
  static async createKeyResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(createKeyResultSchema, req.body);
      const keyResult = await OKRsService.createKeyResult(id, validatedData);
      successResponse(res, keyResult, 'Key result created successfully', 201);
    } catch (error) {
      logger.error('Create key result error:', error);
      next(error);
    }
  }

  /**
   * Update key result
   * PUT /api/okrs/:okrId/key-results/:krId
   */
  static async updateKeyResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { okrId, krId } = req.params;
      const validatedData = validateRequest(updateKeyResultSchema, req.body);
      const keyResult = await OKRsService.updateKeyResult(okrId, krId, validatedData);
      successResponse(res, keyResult, 'Key result updated successfully', 200);
    } catch (error) {
      logger.error('Update key result error:', error);
      next(error);
    }
  }

  /**
   * Delete key result
   * DELETE /api/okrs/:okrId/key-results/:krId
   */
  static async deleteKeyResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { okrId, krId } = req.params;
      await OKRsService.deleteKeyResult(okrId, krId);
      successResponse(res, null, 'Key result deleted successfully', 200);
    } catch (error) {
      logger.error('Delete key result error:', error);
      next(error);
    }
  }

  /**
   * Update key result progress
   * PATCH /api/okrs/:okrId/key-results/:krId/progress
   */
  static async updateKeyResultProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { okrId, krId } = req.params;
      const validatedData = validateRequest(updateKeyResultProgressSchema, req.body);
      const keyResult = await OKRsService.updateKeyResultProgress(okrId, krId, validatedData);
      successResponse(res, keyResult, 'Key result progress updated successfully', 200);
    } catch (error) {
      logger.error('Update key result progress error:', error);
      next(error);
    }
  }
}
