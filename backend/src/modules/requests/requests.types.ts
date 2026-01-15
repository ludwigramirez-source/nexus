import { z } from 'zod';
import { RequestType, RequestStatus, Priority, ProductName } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.nativeEnum(RequestType),
  priority: z.nativeEnum(Priority),
  estimatedHours: z.number().positive('Estimated hours must be positive'),
  productId: z.string().cuid().optional(),
  clientId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
  assignedUserIds: z.array(z.string().cuid()).optional(),
});

export const updateRequestSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  type: z.nativeEnum(RequestType).optional(),
  priority: z.nativeEnum(Priority).optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().nonnegative().optional(),
  productId: z.string().cuid().optional(),
  clientId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
});

export const changeStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus),
  comment: z.string().optional(),
});

export const assignUsersSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1, 'At least one user must be assigned'),
});

export const createActivitySchema = z.object({
  type: z.string().min(1, 'Activity type is required'),
  description: z.string().min(1, 'Description is required'),
  metadata: z.record(z.any()).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  parentId: z.string().cuid().nullish(), // Accepts null, undefined, or string
});

export const requestFiltersSchema = z.object({
  status: z.nativeEnum(RequestStatus).optional(),
  type: z.nativeEnum(RequestType).optional(),
  priority: z.nativeEnum(Priority).optional(),
  productId: z.string().cuid().optional(),
  assignedTo: z.string().cuid().optional(),
  clientId: z.string().cuid().optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'estimatedHours']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateRequestDTO {
  title: string;
  description: string;
  type: RequestType;
  priority: Priority;
  estimatedHours: number;
  productId?: string;
  clientId?: string;
  tags?: string[];
  assignedUserIds?: string[];
}

export interface UpdateRequestDTO {
  title?: string;
  description?: string;
  type?: RequestType;
  priority?: Priority;
  estimatedHours?: number;
  actualHours?: number;
  productId?: string;
  clientId?: string;
  tags?: string[];
}

export interface ChangeStatusDTO {
  status: RequestStatus;
  comment?: string;
}

export interface AssignUsersDTO {
  userIds: string[];
}

export interface CreateActivityDTO {
  type: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface CreateCommentDTO {
  content: string;
  parentId?: string;
}

export interface RequestFilters {
  status?: RequestStatus;
  type?: RequestType;
  priority?: Priority;
  productId?: string;
  assignedTo?: string;
  clientId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'estimatedHours';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Response Types
// ============================================================================

export interface RequestResponse {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  priority: Priority;
  estimatedHours: number;
  actualHours: number | null;
  productId: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  product?: {
    id: string;
    name: string;
  } | null;
  client?: {
    id: string;
    name: string;
  } | null;
  assignedUsers?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  _count?: {
    activities: number;
    comments: number;
  };
}

export interface ActivityResponse {
  id: string;
  type: string;
  description: string;
  metadata: any;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  replies?: CommentResponse[];
}
