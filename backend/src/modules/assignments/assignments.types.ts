import { z } from 'zod';
import { AssignmentStatus } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createAssignmentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  requestId: z.string().uuid('Invalid request ID'),
  weekStart: z.string().datetime('Invalid date format'),
  allocatedHours: z.number().positive('Hours must be positive').max(40, 'Cannot exceed 40 hours'),
  notes: z.string().optional(),
});

export const updateAssignmentSchema = z.object({
  allocatedHours: z.number().positive().max(40).optional(),
  actualHours: z.number().nonnegative().optional(),
  status: z.nativeEnum(AssignmentStatus).optional(),
  notes: z.string().optional(),
});

export const assignmentFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  requestId: z.string().uuid().optional(),
  weekStart: z.string().datetime().optional(),
  status: z.nativeEnum(AssignmentStatus).optional(),
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateAssignmentDTO {
  userId: string;
  requestId: string;
  weekStart: string;
  allocatedHours: number;
  notes?: string;
}

export interface UpdateAssignmentDTO {
  allocatedHours?: number;
  actualHours?: number;
  status?: AssignmentStatus;
  notes?: string;
}

export interface AssignmentFilters {
  userId?: string;
  requestId?: string;
  weekStart?: string;
  status?: AssignmentStatus;
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface AssignmentResponse {
  id: string;
  weekStart: Date;
  allocatedHours: number;
  actualHours: number;
  status: AssignmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    capacity: number;
  };
  request: {
    id: string;
    title: string;
    type: string;
    priority: string;
    status: string;
  };
}

export interface CapacitySummary {
  userId: string;
  userName: string;
  weekStart: Date;
  capacity: number;
  totalAllocated: number;
  totalCompleted: number;
  utilization: number;
  assignments: AssignmentResponse[];
}
