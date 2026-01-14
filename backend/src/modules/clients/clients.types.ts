import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createClientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  nit: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  contactPerson: z.string().min(2).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  products: z.array(z.string()).default([]),
  mrr: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  healthScore: z.number().int().min(0).max(100).default(100),
  tier: z.enum(['BASIC', 'PRO', 'ENTERPRISE']).default('BASIC'),
  status: z.enum(['ACTIVE', 'CHURNED', 'AT_RISK']).default('ACTIVE'),
});

export const updateClientSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  nit: z.string().optional(),
  email: z.string().email().optional(),
  contactPerson: z.string().min(2).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  products: z.array(z.string()).optional(),
  mrr: z.number().min(0).optional(),
  currency: z.string().optional(),
  healthScore: z.number().int().min(0).max(100).optional(),
  tier: z.enum(['BASIC', 'PRO', 'ENTERPRISE']).optional(),
  status: z.enum(['ACTIVE', 'CHURNED', 'AT_RISK']).optional(),
});

export const updateHealthScoreSchema = z.object({
  healthScore: z.number().int().min(0).max(100),
});

export const clientFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateClientDTO {
  name: string;
  nit?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  notes?: string;
  products?: string[];
  mrr?: number;
  currency?: string;
  healthScore?: number;
  tier?: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status?: 'ACTIVE' | 'CHURNED' | 'AT_RISK';
}

export interface UpdateClientDTO {
  name?: string;
  nit?: string;
  email?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  notes?: string;
  products?: string[];
  mrr?: number;
  currency?: string;
  healthScore?: number;
  tier?: 'BASIC' | 'PRO' | 'ENTERPRISE';
  status?: 'ACTIVE' | 'CHURNED' | 'AT_RISK';
}

export interface UpdateHealthScoreDTO {
  healthScore: number;
}

export interface ClientFilters {
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ClientResponse {
  id: string;
  name: string;
  nit: string | null;
  email: string | null;
  contactPerson: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  products: string[];
  mrr: number;
  currency: string;
  healthScore: number;
  tier: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    requests: number;
  };
}
