import type { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service';
import {
  createProductSchema,
  updateProductSchema,
  createRoadmapItemSchema,
  updateRoadmapItemSchema,
} from './products.types';
import { successResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import { getSessionData } from '../../utils/request.util';
import logger from '../../config/logger';

export class ProductsController {
  /**
   * Get all products
   * GET /api/products
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await ProductsService.getAll();
      successResponse(res, products, 'Products retrieved successfully', 200);
    } catch (error) {
      logger.error('Get products error:', error);
      next(error);
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductsService.getById(id);
      successResponse(res, product, 'Product retrieved successfully', 200);
    } catch (error) {
      logger.error('Get product by ID error:', error);
      next(error);
    }
  }

  /**
   * Create new product
   * POST /api/products
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(createProductSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      const product = await ProductsService.create(validatedData, sessionData);
      successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      logger.error('Create product error:', error);
      next(error);
    }
  }

  /**
   * Update product
   * PUT /api/products/:id
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateProductSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      const product = await ProductsService.update(id, validatedData, sessionData);
      successResponse(res, product, 'Product updated successfully', 200);
    } catch (error) {
      logger.error('Update product error:', error);
      next(error);
    }
  }

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      await ProductsService.delete(id, sessionData);
      successResponse(res, null, 'Product deleted successfully', 200);
    } catch (error) {
      logger.error('Delete product error:', error);
      next(error);
    }
  }

  /**
   * Get product roadmap
   * GET /api/products/:id/roadmap
   */
  static async getRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const roadmap = await ProductsService.getRoadmap(id);
      successResponse(res, roadmap, 'Roadmap retrieved successfully', 200);
    } catch (error) {
      logger.error('Get roadmap error:', error);
      next(error);
    }
  }

  /**
   * Create roadmap item
   * POST /api/products/:id/roadmap
   */
  static async createRoadmapItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(createRoadmapItemSchema, req.body);
      const roadmapItem = await ProductsService.createRoadmapItem(id, validatedData);
      successResponse(res, roadmapItem, 'Roadmap item created successfully', 201);
    } catch (error) {
      logger.error('Create roadmap item error:', error);
      next(error);
    }
  }

  /**
   * Update roadmap item
   * PUT /api/products/:productId/roadmap/:itemId
   */
  static async updateRoadmapItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, itemId } = req.params;
      const validatedData = validateRequest(updateRoadmapItemSchema, req.body);
      const roadmapItem = await ProductsService.updateRoadmapItem(productId, itemId, validatedData);
      successResponse(res, roadmapItem, 'Roadmap item updated successfully', 200);
    } catch (error) {
      logger.error('Update roadmap item error:', error);
      next(error);
    }
  }

  /**
   * Delete roadmap item
   * DELETE /api/products/:productId/roadmap/:itemId
   */
  static async deleteRoadmapItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, itemId } = req.params;
      await ProductsService.deleteRoadmapItem(productId, itemId);
      successResponse(res, null, 'Roadmap item deleted successfully', 200);
    } catch (error) {
      logger.error('Delete roadmap item error:', error);
      next(error);
    }
  }
}
