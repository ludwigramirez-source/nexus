import { z } from 'zod';
import { ProductCategory, ProductStatus, BillingRecurrence, RoadmapStatus, RoadmapPriority } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createProductSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(10),
  type: z.nativeEnum(ProductCategory),
  price: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  hasVAT: z.boolean().default(true),
  vatRate: z.number().min(0).max(100).optional(),
  recurrence: z.nativeEnum(BillingRecurrence).optional(),
  repositoryUrl: z.string().url().optional(),
  productionUrl: z.string().url().optional(),
  stagingUrl: z.string().url().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  type: z.nativeEnum(ProductCategory).optional(),
  price: z.number().min(0).optional(),
  currency: z.string().optional(),
  hasVAT: z.boolean().optional(),
  vatRate: z.number().min(0).max(100).optional(),
  recurrence: z.nativeEnum(BillingRecurrence).optional(),
  repositoryUrl: z.string().url().optional(),
  productionUrl: z.string().url().optional(),
  stagingUrl: z.string().url().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
});

export const createRoadmapItemSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  priority: z.nativeEnum(RoadmapPriority),
  targetQuarter: z.string().regex(/^Q[1-4] \d{4}$/),
  estimatedHours: z.number().positive().optional(),
});

export const updateRoadmapItemSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  priority: z.nativeEnum(RoadmapPriority).optional(),
  status: z.nativeEnum(RoadmapStatus).optional(),
  targetQuarter: z.string().regex(/^Q[1-4] \d{4}$/).optional(),
  estimatedHours: z.number().positive().optional(),
  completedAt: z.string().datetime().optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateProductDTO {
  name: string;
  description: string;
  type: ProductCategory;
  price: number;
  currency: string;
  hasVAT: boolean;
  vatRate?: number;
  recurrence?: BillingRecurrence;
  repositoryUrl?: string;
  productionUrl?: string;
  stagingUrl?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  type?: ProductCategory;
  price?: number;
  currency?: string;
  hasVAT?: boolean;
  vatRate?: number;
  recurrence?: BillingRecurrence;
  repositoryUrl?: string;
  productionUrl?: string;
  stagingUrl?: string;
  status?: ProductStatus;
}

export interface CreateRoadmapItemDTO {
  title: string;
  description: string;
  priority: RoadmapPriority;
  targetQuarter: string;
  estimatedHours?: number;
}

export interface UpdateRoadmapItemDTO {
  title?: string;
  description?: string;
  priority?: RoadmapPriority;
  status?: RoadmapStatus;
  targetQuarter?: string;
  estimatedHours?: number;
  completedAt?: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface RoadmapItemResponse {
  id: string;
  title: string;
  description: string;
  priority: RoadmapPriority;
  status: RoadmapStatus;
  targetQuarter: string;
  estimatedHours: number | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  type: ProductCategory;
  price: number;
  currency: string;
  hasVAT: boolean;
  vatRate: number | null;
  recurrence: BillingRecurrence | null;
  status: ProductStatus;
  repositoryUrl: string | null;
  productionUrl: string | null;
  stagingUrl: string | null;
  launchedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roadmapItems?: RoadmapItemResponse[];
  _count?: {
    roadmapItems: number;
    requests: number;
  };
}
