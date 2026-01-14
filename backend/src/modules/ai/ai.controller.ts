import type { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { completionSchema, insightsSchema, similaritySchema } from './ai.types';
import { successResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import logger from '../../config/logger';

export class AIController {
  /**
   * Generate AI completion
   * POST /api/ai/completion
   */
  static async generateCompletion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(completionSchema, req.body);
      const result = await AIService.generateCompletion(validatedData);
      successResponse(res, result, 'Completion generated successfully', 200);
    } catch (error) {
      logger.error('Generate completion error:', error);
      next(error);
    }
  }

  /**
   * Generate insights
   * POST /api/ai/insights
   */
  static async generateInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(insightsSchema, req.body);
      const insights = await AIService.generateInsights(validatedData);
      successResponse(res, insights, 'Insights generated successfully', 200);
    } catch (error) {
      logger.error('Generate insights error:', error);
      next(error);
    }
  }

  /**
   * Analyze similarity
   * POST /api/ai/analyze-similarity
   */
  static async analyzeSimilarity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(similaritySchema, req.body);
      const result = await AIService.analyzeSimilarity(validatedData);
      successResponse(res, result, 'Similarity analysis completed successfully', 200);
    } catch (error) {
      logger.error('Analyze similarity error:', error);
      next(error);
    }
  }
}
