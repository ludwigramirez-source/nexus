import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

export const activityLogFiltersSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateActivityLogDTO {
  userId?: string;
  userName: string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface ActivityLogFilters {
  userId?: string;
  action?: string;
  entity?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ActivityLogResponse {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  description: string;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface ActivityLogWithUserResponse extends ActivityLogResponse {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  } | null;
}

export interface ActivityLogsListResponse {
  logs: ActivityLogWithUserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
