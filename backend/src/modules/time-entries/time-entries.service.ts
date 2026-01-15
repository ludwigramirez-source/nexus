import prisma from '../../config/database';
import { AppError } from '../../utils/errors.util';
import {
  TimeEntryResponse,
  StartTimeEntryDTO,
  PauseTimeEntryDTO,
  CompleteTimeEntryDTO,
  TimeEntryStatus,
} from './time-entries.types';

export class TimeEntriesService {
  /**
   * Get all time entries for a specific request
   */
  static async getByRequestId(requestId: string): Promise<TimeEntryResponse[]> {
    const timeEntries = await prisma.timeEntry.findMany({
      where: { requestId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return timeEntries;
  }

  /**
   * Get active time entry for a user on a specific request
   */
  static async getActiveEntry(requestId: string, userId: string) {
    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        requestId,
        userId,
        status: {
          in: ['ACTIVE', 'PAUSED'],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return activeEntry;
  }

  /**
   * Start a new time entry
   */
  static async start(
    requestId: string,
    userId: string,
    data: StartTimeEntryDTO
  ): Promise<TimeEntryResponse> {
    // Check if there's already an active entry for this user on this request
    const existingActive = await this.getActiveEntry(requestId, userId);
    if (existingActive) {
      throw new AppError('Ya tienes una sesión de tiempo activa para esta solicitud', 400);
    }

    // Create new time entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        requestId,
        userId,
        startedAt: new Date(),
        status: TimeEntryStatus.ACTIVE,
        description: data.description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return timeEntry;
  }

  /**
   * Pause an active time entry
   */
  static async pause(
    requestId: string,
    userId: string,
    data: PauseTimeEntryDTO
  ): Promise<TimeEntryResponse> {
    const activeEntry = await this.getActiveEntry(requestId, userId);

    if (!activeEntry) {
      throw new AppError('No hay una sesión de tiempo activa para pausar', 404);
    }

    if (activeEntry.status === TimeEntryStatus.PAUSED) {
      throw new AppError('La sesión ya está pausada', 400);
    }

    // Calculate duration up to now
    const now = new Date();
    const startTime = new Date(activeEntry.startedAt);
    const durationMs = now.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    const updatedEntry = await prisma.timeEntry.update({
      where: { id: activeEntry.id },
      data: {
        status: TimeEntryStatus.PAUSED,
        pausedAt: now,
        duration: durationHours,
        description: data.description || activeEntry.description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedEntry;
  }

  /**
   * Resume a paused time entry
   */
  static async resume(requestId: string, userId: string): Promise<TimeEntryResponse> {
    const activeEntry = await this.getActiveEntry(requestId, userId);

    if (!activeEntry) {
      throw new AppError('No hay una sesión de tiempo pausada para reanudar', 404);
    }

    if (activeEntry.status !== TimeEntryStatus.PAUSED) {
      throw new AppError('La sesión debe estar pausada para poder reanudarla', 400);
    }

    // Resume by setting status back to ACTIVE and clearing pausedAt
    const updatedEntry = await prisma.timeEntry.update({
      where: { id: activeEntry.id },
      data: {
        status: TimeEntryStatus.ACTIVE,
        pausedAt: null,
        // Reset start time to account for the paused period
        startedAt: new Date(Date.now() - (activeEntry.duration * 60 * 60 * 1000)),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedEntry;
  }

  /**
   * Complete a time entry and update request's actual hours
   */
  static async complete(
    requestId: string,
    userId: string,
    data: CompleteTimeEntryDTO
  ): Promise<TimeEntryResponse> {
    const activeEntry = await this.getActiveEntry(requestId, userId);

    if (!activeEntry) {
      throw new AppError('No hay una sesión de tiempo activa para terminar', 404);
    }

    // Calculate final duration
    const now = new Date();
    let finalDuration = activeEntry.duration;

    if (activeEntry.status === TimeEntryStatus.ACTIVE) {
      // If still active, calculate time since start
      const startTime = new Date(activeEntry.startedAt);
      const durationMs = now.getTime() - startTime.getTime();
      finalDuration = durationMs / (1000 * 60 * 60);
    }
    // If paused, use the stored duration

    // Update time entry as completed
    const completedEntry = await prisma.timeEntry.update({
      where: { id: activeEntry.id },
      data: {
        status: TimeEntryStatus.COMPLETED,
        endedAt: now,
        duration: finalDuration,
        description: data.description || activeEntry.description,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update request's actual hours
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { timeEntries: true },
    });

    if (request) {
      const totalActualHours = request.timeEntries
        .filter((entry) => entry.status === TimeEntryStatus.COMPLETED)
        .reduce((sum, entry) => sum + entry.duration, 0);

      await prisma.request.update({
        where: { id: requestId },
        data: { actualHours: totalActualHours },
      });
    }

    return completedEntry;
  }

  /**
   * Delete a time entry (only for completed entries)
   */
  static async delete(timeEntryId: string, userId: string): Promise<void> {
    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id: timeEntryId },
      include: { request: true },
    });

    if (!timeEntry) {
      throw new AppError('Entrada de tiempo no encontrada', 404);
    }

    // Only the owner can delete their time entries
    if (timeEntry.userId !== userId) {
      throw new AppError('No tienes permiso para eliminar esta entrada de tiempo', 403);
    }

    // Delete the entry
    await prisma.timeEntry.delete({
      where: { id: timeEntryId },
    });

    // Recalculate request's actual hours
    const request = await prisma.request.findUnique({
      where: { id: timeEntry.requestId },
      include: { timeEntries: true },
    });

    if (request) {
      const totalActualHours = request.timeEntries
        .filter((entry) => entry.status === TimeEntryStatus.COMPLETED)
        .reduce((sum, entry) => sum + entry.duration, 0);

      await prisma.request.update({
        where: { id: timeEntry.requestId },
        data: { actualHours: totalActualHours },
      });
    }
  }
}
