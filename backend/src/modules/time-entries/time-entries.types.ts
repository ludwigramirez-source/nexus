import { z } from 'zod';

// Zod schemas for validation
export const startTimeEntrySchema = z.object({
  description: z.string().optional(),
});

export const pauseTimeEntrySchema = z.object({
  description: z.string().optional(),
});

export const completeTimeEntrySchema = z.object({
  description: z.string().optional(),
});

// TypeScript types
export enum TimeEntryStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export interface TimeEntryResponse {
  id: string;
  requestId: string;
  userId: string;
  startedAt: Date;
  pausedAt?: Date | null;
  endedAt?: Date | null;
  duration: number;
  status: TimeEntryStatus;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type StartTimeEntryDTO = z.infer<typeof startTimeEntrySchema>;
export type PauseTimeEntryDTO = z.infer<typeof pauseTimeEntrySchema>;
export type CompleteTimeEntryDTO = z.infer<typeof completeTimeEntrySchema>;
