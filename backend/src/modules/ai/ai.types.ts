import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

export const completionSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  maxTokens: z.number().int().positive().max(4000).default(1000).optional(),
  temperature: z.number().min(0).max(2).default(0.7).optional(),
});

export const insightsSchema = z.object({
  data: z.record(z.any()),
  focus: z.string().optional(),
});

export const similaritySchema = z.object({
  requestId: z.string().uuid(),
  threshold: z.number().min(0).max(1).default(0.7).optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CompletionDTO {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface InsightsDTO {
  data: Record<string, any>;
  focus?: string;
}

export interface SimilarityDTO {
  requestId: string;
  threshold?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface CompletionResponse {
  completion: string;
  tokens: number;
}

export interface InsightsResponse {
  insights: string[];
  recommendations: string[];
  trends: string[];
  alerts: string[];
}

export interface SimilarityResponse {
  requestId: string;
  similarRequests: Array<{
    id: string;
    title: string;
    description: string;
    similarityScore: number;
    status: string;
    createdAt: Date;
  }>;
}
