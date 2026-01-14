import type { Request, Response, NextFunction } from 'express';
import { RequestsService } from './requests.service';
import {
  createRequestSchema,
  updateRequestSchema,
  changeStatusSchema,
  assignUsersSchema,
  createActivitySchema,
  createCommentSchema,
  requestFiltersSchema,
} from './requests.types';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import logger from '../../config/logger';

export class RequestsController {
  /**
   * Get all requests with filters
   * GET /api/requests
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      // Validate filters
      const filters = validateRequest(requestFiltersSchema, {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      const result = await RequestsService.getAll(filters, userId);

      paginatedResponse(
        res,
        result.requests,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      logger.error('Get requests error:', error);
      next(error);
    }
  }

  /**
   * Get request by ID
   * GET /api/requests/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const request = await RequestsService.getById(id);

      successResponse(res, request, 'Request retrieved successfully', 200);
    } catch (error) {
      logger.error('Get request by ID error:', error);
      next(error);
    }
  }

  /**
   * Create new request
   * POST /api/requests
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      // Validate request
      const validatedData = validateRequest(createRequestSchema, req.body);

      const request = await RequestsService.create(validatedData, userId);

      successResponse(res, request, 'Request created successfully', 201);
    } catch (error) {
      logger.error('Create request error:', error);
      next(error);
    }
  }

  /**
   * Update request
   * PUT /api/requests/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(updateRequestSchema, req.body);

      const request = await RequestsService.update(id, validatedData, userId);

      successResponse(res, request, 'Request updated successfully', 200);
    } catch (error) {
      logger.error('Update request error:', error);
      next(error);
    }
  }

  /**
   * Delete request
   * DELETE /api/requests/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await RequestsService.delete(id);

      successResponse(res, null, 'Request deleted successfully', 200);
    } catch (error) {
      logger.error('Delete request error:', error);
      next(error);
    }
  }

  /**
   * Change request status
   * PATCH /api/requests/:id/status
   */
  static async changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(changeStatusSchema, req.body);

      const request = await RequestsService.changeStatus(id, validatedData, userId);

      successResponse(res, request, 'Request status changed successfully', 200);
    } catch (error) {
      logger.error('Change request status error:', error);
      next(error);
    }
  }

  /**
   * Assign users to request
   * PATCH /api/requests/:id/assign
   */
  static async assignUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(assignUsersSchema, req.body);

      const request = await RequestsService.assignUsers(id, validatedData, userId);

      successResponse(res, request, 'Users assigned successfully', 200);
    } catch (error) {
      logger.error('Assign users error:', error);
      next(error);
    }
  }

  /**
   * Get request activities
   * GET /api/requests/:id/activities
   */
  static async getActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const activities = await RequestsService.getActivities(id);

      successResponse(res, activities, 'Activities retrieved successfully', 200);
    } catch (error) {
      logger.error('Get activities error:', error);
      next(error);
    }
  }

  /**
   * Create request activity
   * POST /api/requests/:id/activities
   */
  static async createActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(createActivitySchema, req.body);

      const activity = await RequestsService.createActivity(id, validatedData, userId);

      successResponse(res, activity, 'Activity created successfully', 201);
    } catch (error) {
      logger.error('Create activity error:', error);
      next(error);
    }
  }

  /**
   * Get request comments
   * GET /api/requests/:id/comments
   */
  static async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const comments = await RequestsService.getComments(id);

      successResponse(res, comments, 'Comments retrieved successfully', 200);
    } catch (error) {
      logger.error('Get comments error:', error);
      next(error);
    }
  }

  /**
   * Create request comment
   * POST /api/requests/:id/comments
   */
  static async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return errorResponse(res, 'Unauthorized', 401);
      }

      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(createCommentSchema, req.body);

      const comment = await RequestsService.createComment(id, validatedData, userId);

      successResponse(res, comment, 'Comment created successfully', 201);
    } catch (error) {
      logger.error('Create comment error:', error);
      next(error);
    }
  }
}
