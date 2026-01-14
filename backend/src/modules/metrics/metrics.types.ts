import { z } from 'zod';

// ============================================================================
// Validation Schemas
// ============================================================================

export const createWeeklyMetricSchema = z.object({
  weekStart: z.string().datetime(),
  totalRequests: z.number().int().nonnegative(),
  completedRequests: z.number().int().nonnegative(),
  productRequests: z.number().int().nonnegative(),
  customRequests: z.number().int().nonnegative(),
  totalHours: z.number().nonnegative(),
  teamUtilization: z.number().min(0).max(100),
  notes: z.string().optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ============================================================================
// DTOs
// ============================================================================

export interface CreateWeeklyMetricDTO {
  weekStart: string;
  totalRequests: number;
  completedRequests: number;
  productRequests: number;
  customRequests: number;
  totalHours: number;
  teamUtilization: number;
  notes?: string;
}

export interface DateRangeDTO {
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface WeeklyMetricResponse {
  id: string;
  weekStart: Date;
  totalRequests: number;
  completedRequests: number;
  productRequests: number;
  customRequests: number;
  totalHours: number;
  teamUtilization: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OverviewMetrics {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  totalClients: number;
  totalProducts: number;
  averageUtilization: number;
  requestsByStatus: Record<string, number>;
  requestsByType: Record<string, number>;
  requestsByPriority: Record<string, number>;
}

export interface CapacityMetrics {
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  byUser: Array<{
    userId: string;
    userName: string;
    capacity: number;
    allocated: number;
    available: number;
    utilization: number;
  }>;
}

export interface RequestsFunnelMetrics {
  pending: number;
  inProgress: number;
  review: number;
  completed: number;
  deployed: number;
  cancelled: number;
  averageCompletionTime: number;
}

export interface ProductVsCustomMetrics {
  productRequests: number;
  customRequests: number;
  productPercentage: number;
  customPercentage: number;
  byProduct: Record<string, number>;
}

export interface TeamVelocityMetrics {
  averageRequestsPerWeek: number;
  averageHoursPerRequest: number;
  completionRate: number;
  weeklyTrend: Array<{
    week: string;
    requestsCompleted: number;
    hoursWorked: number;
  }>;
}

export interface AIInsights {
  insights: string[];
  recommendations: string[];
  trends: string[];
  alerts: string[];
}
