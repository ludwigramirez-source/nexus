import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { errorResponse } from '../utils/response.util';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation error', 400, err.errors);
  }

  if (err.name === 'UnauthorizedError') {
    return errorResponse(res, 'Unauthorized', 401);
  }

  return errorResponse(res, err.message || 'Internal server error', err.statusCode || 500);
};
