import { z } from 'zod';
import { UserStatus } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  role: z.string().min(1).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  capacity: z.number().positive().optional(),
  skills: z.array(z.string()).optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export const userFiltersSchema = z.object({
  status: z.nativeEnum(UserStatus).optional(),
  role: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
  capacity?: number;
  skills?: string[];
}

export interface UpdateUserStatusDTO {
  status: UserStatus;
}

export interface UserFilters {
  status?: UserStatus;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
  avatar: string | null;
  capacity: number;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithStatsResponse extends UserResponse {
  stats: {
    activeRequests: number;
    completedRequests: number;
    totalAssignments: number;
    currentUtilization: number;
  };
}
