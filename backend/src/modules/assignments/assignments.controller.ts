import type { Request, Response, NextFunction } from 'express';
import { AssignmentsService } from './assignments.service';
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  assignmentFiltersSchema,
} from './assignments.types';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import logger from '../../config/logger';

export class AssignmentsController {
  /**
   * Get all assignments with filters
   * GET /api/assignments
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate filters
      const filters = validateRequest(assignmentFiltersSchema, {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      const result = await AssignmentsService.getAll(filters);

      paginatedResponse(
        res,
        result.assignments,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      logger.error('Get assignments error:', error);
      next(error);
    }
  }

  /**
   * Get assignment by ID
   * GET /api/assignments/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const assignment = await AssignmentsService.getById(id);

      successResponse(res, assignment, 'Assignment retrieved successfully', 200);
    } catch (error) {
      logger.error('Get assignment by ID error:', error);
      next(error);
    }
  }

  /**
   * Create new assignment
   * POST /api/assignments
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request
      const validatedData = validateRequest(createAssignmentSchema, req.body);

      const assignment = await AssignmentsService.create(validatedData);

      successResponse(res, assignment, 'Assignment created successfully', 201);
    } catch (error) {
      logger.error('Create assignment error:', error);
      next(error);
    }
  }

  /**
   * Update assignment
   * PUT /api/assignments/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Validate request
      const validatedData = validateRequest(updateAssignmentSchema, req.body);

      const assignment = await AssignmentsService.update(id, validatedData);

      successResponse(res, assignment, 'Assignment updated successfully', 200);
    } catch (error) {
      logger.error('Update assignment error:', error);
      next(error);
    }
  }

  /**
   * Delete assignment
   * DELETE /api/assignments/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await AssignmentsService.delete(id);

      successResponse(res, null, 'Assignment deleted successfully', 200);
    } catch (error) {
      logger.error('Delete assignment error:', error);
      next(error);
    }
  }

  /**
   * Get assignments by week
   * GET /api/assignments/by-week/:weekStart
   */
  static async getByWeek(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { weekStart } = req.params;

      const assignments = await AssignmentsService.getByWeek(weekStart);

      successResponse(res, assignments, 'Assignments retrieved successfully', 200);
    } catch (error) {
      logger.error('Get assignments by week error:', error);
      next(error);
    }
  }

  /**
   * Get assignments by user
   * GET /api/assignments/by-user/:userId
   */
  static async getByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const assignments = await AssignmentsService.getByUser(userId);

      successResponse(res, assignments, 'Assignments retrieved successfully', 200);
    } catch (error) {
      logger.error('Get assignments by user error:', error);
      next(error);
    }
  }

  /**
   * Get capacity summary
   * GET /api/assignments/capacity-summary
   */
  static async getCapacitySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const weekStart = req.query.weekStart as string | undefined;

      const summary = await AssignmentsService.getCapacitySummary(weekStart);

      successResponse(res, summary, 'Capacity summary retrieved successfully', 200);
    } catch (error) {
      logger.error('Get capacity summary error:', error);
      next(error);
    }
  }
}
