import type { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { updateUserSchema, updateUserStatusSchema, userFiltersSchema } from './users.types';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import { getSessionData } from '../../utils/request.util';
import logger from '../../config/logger';

export class UsersController {
  /**
   * Get all users with filters
   * GET /api/users
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate filters
      const filters = validateRequest(userFiltersSchema, {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      const result = await UsersService.getAll(filters);

      paginatedResponse(
        res,
        result.users,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      logger.error('Get users error:', error);
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const includeStats = req.query.includeStats === 'true';

      if (includeStats) {
        const user = await UsersService.getByIdWithStats(id);
        return successResponse(res, user, 'User retrieved successfully', 200);
      }

      const user = await UsersService.getById(id);
      successResponse(res, user, 'User retrieved successfully', 200);
    } catch (error) {
      logger.error('Get user by ID error:', error);
      next(error);
    }
  }

  /**
   * Update user
   * PUT /api/users/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(updateUserSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      const user = await UsersService.update(id, validatedData, sessionData);

      successResponse(res, user, 'User updated successfully', 200);
    } catch (error) {
      logger.error('Update user error:', error);
      next(error);
    }
  }

  /**
   * Update user status
   * PATCH /api/users/:id/status
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(updateUserStatusSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      const user = await UsersService.updateStatus(id, validatedData, sessionData);

      successResponse(res, user, 'User status updated successfully', 200);
    } catch (error) {
      logger.error('Update user status error:', error);
      next(error);
    }
  }

  /**
   * Update user password
   * PATCH /api/users/:id/password
   */
  static async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password || password.length < 8) {
        return errorResponse(res, 'Password must be at least 8 characters', 400);
      }

      await UsersService.updatePassword(id, password);

      successResponse(res, null, 'Password updated successfully', 200);
    } catch (error) {
      logger.error('Update password error:', error);
      next(error);
    }
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/users/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      await UsersService.delete(id, sessionData);

      successResponse(res, null, 'User deleted successfully', 200);
    } catch (error) {
      logger.error('Delete user error:', error);
      next(error);
    }
  }
}
