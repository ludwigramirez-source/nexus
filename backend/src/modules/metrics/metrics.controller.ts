import type { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';
import { createWeeklyMetricSchema, dateRangeSchema } from './metrics.types';
import { successResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import logger from '../../config/logger';

export class MetricsController {
  /**
   * Get overview metrics
   * GET /api/metrics/overview
   */
  static async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await MetricsService.getOverview();
      successResponse(res, metrics, 'Overview metrics retrieved successfully', 200);
    } catch (error) {
      logger.error('Get overview metrics error:', error);
      next(error);
    }
  }

  /**
   * Get weekly metrics
   * GET /api/metrics/weekly
   */
  static async getWeeklyMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dateRange = req.query.startDate || req.query.endDate
        ? validateRequest(dateRangeSchema, req.query)
        : undefined;

      const metrics = await MetricsService.getWeeklyMetrics(dateRange);
      successResponse(res, metrics, 'Weekly metrics retrieved successfully', 200);
    } catch (error) {
      logger.error('Get weekly metrics error:', error);
      next(error);
    }
  }

  /**
   * Create weekly metric
   * POST /api/metrics/weekly
   */
  static async createWeeklyMetric(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(createWeeklyMetricSchema, req.body);
      const metric = await MetricsService.createWeeklyMetric(validatedData);
      successResponse(res, metric, 'Weekly metric created successfully', 201);
    } catch (error) {
      logger.error('Create weekly metric error:', error);
      next(error);
    }
  }

  /**
   * Get capacity metrics
   * GET /api/metrics/capacity
   */
  static async getCapacityMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await MetricsService.getCapacityMetrics();
      successResponse(res, metrics, 'Capacity metrics retrieved successfully', 200);
    } catch (error) {
      logger.error('Get capacity metrics error:', error);
      next(error);
    }
  }

  /**
   * Get requests funnel
   * GET /api/metrics/requests-funnel
   */
  static async getRequestsFunnel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await MetricsService.getRequestsFunnel();
      successResponse(res, metrics, 'Requests funnel retrieved successfully', 200);
    } catch (error) {
      logger.error('Get requests funnel error:', error);
      next(error);
    }
  }

  /**
   * Get product vs custom metrics
   * GET /api/metrics/product-vs-custom
   */
  static async getProductVsCustom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await MetricsService.getProductVsCustom();
      successResponse(res, metrics, 'Product vs custom metrics retrieved successfully', 200);
    } catch (error) {
      logger.error('Get product vs custom error:', error);
      next(error);
    }
  }

  /**
   * Get team velocity
   * GET /api/metrics/team-velocity
   */
  static async getTeamVelocity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await MetricsService.getTeamVelocity();
      successResponse(res, metrics, 'Team velocity retrieved successfully', 200);
    } catch (error) {
      logger.error('Get team velocity error:', error);
      next(error);
    }
  }

  /**
   * Generate AI insights
   * POST /api/metrics/generate-insights
   */
  static async generateInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const insights = await MetricsService.generateInsights();
      successResponse(res, insights, 'Insights generated successfully', 200);
    } catch (error) {
      logger.error('Generate insights error:', error);
      next(error);
    }
  }
}
