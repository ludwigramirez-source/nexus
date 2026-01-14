import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import logger from '../../config/logger';
import { generateAICompletion, generateAnalyticsInsights } from '../../utils/ai.service';
import type {
  CompletionDTO,
  InsightsDTO,
  SimilarityDTO,
  CompletionResponse,
  InsightsResponse,
  SimilarityResponse,
} from './ai.types';

export class AIService {
  /**
   * Generate AI completion
   */
  static async generateCompletion(data: CompletionDTO): Promise<CompletionResponse> {
    try {
      const result = await generateAICompletion([
        { role: 'user', content: data.prompt }
      ], {
        maxTokens: data.maxTokens,
        temperature: data.temperature,
      });

      logger.info('AI completion generated');

      return {
        completion: result.content,
        tokens: result.tokens || 0,
      };
    } catch (error) {
      logger.error('Error generating AI completion:', error);
      throw error;
    }
  }

  /**
   * Generate insights from data
   */
  static async generateInsights(data: InsightsDTO): Promise<InsightsResponse> {
    try {
      const insights = await generateAnalyticsInsights(data.data);

      logger.info('AI insights generated');

      return {
        insights,
        recommendations: [],
        trends: [],
        alerts: [],
      };
    } catch (error) {
      logger.error('Error generating AI insights:', error);
      throw error;
    }
  }

  /**
   * Analyze request similarity
   */
  static async analyzeSimilarity(data: SimilarityDTO): Promise<SimilarityResponse> {
    try {
      // Get the request
      const request = await prisma.request.findUnique({
        where: { id: data.requestId },
      });

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      // Get all other requests
      const allRequests = await prisma.request.findMany({
        where: {
          id: { not: data.requestId },
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
        },
      });

      // Analyze similarity using AI
      const similarities: Array<{
        id: string;
        title: string;
        description: string;
        similarityScore: number;
        status: string;
        createdAt: Date;
      }> = [];

      for (const otherRequest of allRequests) {
        const prompt = `
Compare the following two requests and provide a similarity score from 0 to 1, where 1 is identical and 0 is completely different.
Consider the title, description, and overall intent of the requests.

Request 1:
Title: ${request.title}
Description: ${request.description}

Request 2:
Title: ${otherRequest.title}
Description: ${otherRequest.description}

Respond with ONLY a number between 0 and 1, nothing else.
        `.trim();

        try {
          const result = await generateAICompletion([
            { role: 'user', content: prompt }
          ], {
            maxTokens: 10,
            temperature: 0.3,
          });

          const score = parseFloat(result.content.trim());

          if (!isNaN(score) && score >= (data.threshold || 0.7)) {
            similarities.push({
              id: otherRequest.id,
              title: otherRequest.title,
              description: otherRequest.description,
              similarityScore: score,
              status: otherRequest.status,
              createdAt: otherRequest.createdAt,
            });
          }
        } catch (error) {
          logger.warn(`Failed to analyze similarity for request ${otherRequest.id}:`, error);
        }
      }

      // Sort by similarity score
      similarities.sort((a, b) => b.similarityScore - a.similarityScore);

      logger.info(`Found ${similarities.length} similar requests for ${data.requestId}`);

      return {
        requestId: data.requestId,
        similarRequests: similarities,
      };
    } catch (error) {
      logger.error('Error analyzing request similarity:', error);
      throw error;
    }
  }
}
