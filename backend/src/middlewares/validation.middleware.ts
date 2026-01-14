import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../utils/response.util';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(res, 'Validation failed', 400, error.errors);
      }
      return errorResponse(res, 'Validation failed', 400);
    }
  };
};
