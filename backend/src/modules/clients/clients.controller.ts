import type { Request, Response, NextFunction } from 'express';
import { ClientsService } from './clients.service';
import {
  createClientSchema,
  updateClientSchema,
  updateHealthScoreSchema,
  clientFiltersSchema,
} from './clients.types';
import { successResponse, paginatedResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import { getSessionData } from '../../utils/request.util';
import logger from '../../config/logger';

export class ClientsController {
  /**
   * Get all clients with filters
   * GET /api/clients
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = validateRequest(clientFiltersSchema, {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      const result = await ClientsService.getAll(filters);

      paginatedResponse(
        res,
        result.clients,
        result.pagination.page,
        result.pagination.limit,
        result.pagination.total
      );
    } catch (error) {
      logger.error('Get clients error:', error);
      next(error);
    }
  }

  /**
   * Get client by ID
   * GET /api/clients/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const client = await ClientsService.getById(id);
      successResponse(res, client, 'Client retrieved successfully', 200);
    } catch (error) {
      logger.error('Get client by ID error:', error);
      next(error);
    }
  }

  /**
   * Create new client
   * POST /api/clients
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(createClientSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      const client = await ClientsService.create(validatedData, sessionData);
      successResponse(res, client, 'Client created successfully', 201);
    } catch (error) {
      logger.error('Create client error:', error);
      next(error);
    }
  }

  /**
   * Update client
   * PUT /api/clients/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateClientSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      const client = await ClientsService.update(id, validatedData, sessionData);
      successResponse(res, client, 'Client updated successfully', 200);
    } catch (error) {
      logger.error('Update client error:', error);
      next(error);
    }
  }

  /**
   * Delete client
   * DELETE /api/clients/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      await ClientsService.delete(id, sessionData);
      successResponse(res, null, 'Client deleted successfully', 200);
    } catch (error) {
      logger.error('Delete client error:', error);
      next(error);
    }
  }

  /**
   * Get client requests
   * GET /api/clients/:id/requests
   */
  static async getRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const requests = await ClientsService.getRequests(id);
      successResponse(res, requests, 'Client requests retrieved successfully', 200);
    } catch (error) {
      logger.error('Get client requests error:', error);
      next(error);
    }
  }

  /**
   * Update health score
   * PATCH /api/clients/:id/health-score
   */
  static async updateHealthScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateHealthScoreSchema, req.body);
      const client = await ClientsService.updateHealthScore(id, validatedData);
      successResponse(res, client, 'Health score updated successfully', 200);
    } catch (error) {
      logger.error('Update health score error:', error);
      next(error);
    }
  }
}
