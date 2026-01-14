import { z } from 'zod';
import { OKRStatus, Quarter } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createOKRSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10),
  quarter: z.nativeEnum(Quarter),
  year: z.number().int().min(2020).max(2100),
  ownerId: z.string().uuid(),
});

export const updateOKRSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  quarter: z.nativeEnum(Quarter).optional(),
  year: z.number().int().min(2020).max(2100).optional(),
  ownerId: z.string().uuid().optional(),
});

export const updateOKRStatusSchema = z.object({
  status: z.nativeEnum(OKRStatus),
});

export const createKeyResultSchema = z.object({
  title: z.string().min(3).max(200),
  targetValue: z.number(),
  currentValue: z.number().default(0),
  unit: z.string().min(1),
});

export const updateKeyResultSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
  unit: z.string().min(1).optional(),
});

export const updateKeyResultProgressSchema = z.object({
  currentValue: z.number(),
});

export const okrFiltersSchema = z.object({
  quarter: z.nativeEnum(Quarter).optional(),
  year: z.number().int().optional(),
  status: z.nativeEnum(OKRStatus).optional(),
  ownerId: z.string().uuid().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateOKRDTO {
  title: string;
  description: string;
  quarter: Quarter;
  year: number;
  ownerId: string;
}

export interface UpdateOKRDTO {
  title?: string;
  description?: string;
  quarter?: Quarter;
  year?: number;
  ownerId?: string;
}

export interface UpdateOKRStatusDTO {
  status: OKRStatus;
}

export interface CreateKeyResultDTO {
  title: string;
  targetValue: number;
  currentValue?: number;
  unit: string;
}

export interface UpdateKeyResultDTO {
  title?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}

export interface UpdateKeyResultProgressDTO {
  currentValue: number;
}

export interface OKRFilters {
  quarter?: Quarter;
  year?: number;
  status?: OKRStatus;
  ownerId?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface KeyResultResponse {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OKRResponse {
  id: string;
  title: string;
  description: string;
  quarter: Quarter;
  year: number;
  status: OKRStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  keyResults?: KeyResultResponse[];
}
