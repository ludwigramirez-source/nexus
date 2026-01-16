import { z } from 'zod';
import { AssignmentStatus } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createAssignmentSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  requestId: z.string().cuid('Invalid request ID'),
  assignedDate: z.string().datetime('Invalid date format'), // Día específico
  allocatedHours: z.number().positive('Hours must be positive').max(8, 'Cannot exceed 8 hours per day'), // Límite diario
  notes: z.string().optional(),
});

export const createBulkAssignmentsSchema = z.object({
  assignments: z.array(createAssignmentSchema).min(1, 'At least one assignment required'),
});

export const updateAssignmentSchema = z.object({
  allocatedHours: z.number().positive().max(8).optional(), // Límite diario
  actualHours: z.number().nonnegative().optional(),
  status: z.nativeEnum(AssignmentStatus).optional(),
  notes: z.string().optional(),
});

export const assignmentFiltersSchema = z.object({
  userId: z.string().cuid().optional(),
  requestId: z.string().cuid().optional(),
  assignedDate: z.string().datetime().optional(), // Cambio de weekStart a assignedDate
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
  assignedDate: string; // ISO date string
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
  assignedDate?: string; // Cambio de weekStart a assignedDate
  status?: AssignmentStatus;
  page?: number;
  limit?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface AssignmentResponse {
  id: string;
  assignedDate: Date; // Cambio de weekStart a assignedDate
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

export interface DailyCapacitySummary {
  userId: string;
  userName: string;
  date: Date;
  dailyCapacity: number;
  totalAllocated: number;
  available: number;
  utilization: number;
  assignments: AssignmentResponse[];
}
