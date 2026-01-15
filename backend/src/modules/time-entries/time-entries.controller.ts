import { Request, Response, NextFunction } from 'express';
import { TimeEntriesService } from './time-entries.service';
import {
  startTimeEntrySchema,
  pauseTimeEntrySchema,
  completeTimeEntrySchema,
} from './time-entries.types';

export class TimeEntriesController {
  /**
   * GET /api/requests/:requestId/time-entries
   * Get all time entries for a request
   */
  static async getTimeEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const timeEntries = await TimeEntriesService.getByRequestId(requestId);

      res.json({
        success: true,
        data: timeEntries,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/requests/:requestId/time-entries/active
   * Get active time entry for current user
   */
  static async getActiveEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const userId = req.user!.userId;

      const activeEntry = await TimeEntriesService.getActiveEntry(requestId, userId);

      res.json({
        success: true,
        data: activeEntry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/requests/:requestId/time-entries/start
   * Start a new time entry
   */
  static async startTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const userId = req.user!.userId;
      const validatedData = startTimeEntrySchema.parse(req.body);

      const timeEntry = await TimeEntriesService.start(requestId, userId, validatedData);

      res.status(201).json({
        success: true,
        data: timeEntry,
        message: 'Sesión de tiempo iniciada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/requests/:requestId/time-entries/pause
   * Pause active time entry
   */
  static async pauseTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const userId = req.user!.userId;
      const validatedData = pauseTimeEntrySchema.parse(req.body);

      const timeEntry = await TimeEntriesService.pause(requestId, userId, validatedData);

      res.json({
        success: true,
        data: timeEntry,
        message: 'Sesión de tiempo pausada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/requests/:requestId/time-entries/resume
   * Resume paused time entry
   */
  static async resumeTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const userId = req.user!.userId;

      const timeEntry = await TimeEntriesService.resume(requestId, userId);

      res.json({
        success: true,
        data: timeEntry,
        message: 'Sesión de tiempo reanudada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/requests/:requestId/time-entries/complete
   * Complete active time entry
   */
  static async completeTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      const userId = req.user!.userId;
      const validatedData = completeTimeEntrySchema.parse(req.body);

      const timeEntry = await TimeEntriesService.complete(requestId, userId, validatedData);

      res.json({
        success: true,
        data: timeEntry,
        message: 'Sesión de tiempo completada',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/requests/:requestId/time-entries/:timeEntryId
   * Delete a time entry
   */
  static async deleteTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const { timeEntryId } = req.params;
      const userId = req.user!.userId;

      await TimeEntriesService.delete(timeEntryId, userId);

      res.json({
        success: true,
        message: 'Entrada de tiempo eliminada',
      });
    } catch (error) {
      next(error);
    }
  }
}
