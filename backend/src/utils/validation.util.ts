import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errors.util';

/**
 * Validate request data against a Zod schema
 */
export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${messages}`, 400);
    }
    throw error;
  }
}

/**
 * Validate request data and return result with success/error
 */
export function safeValidateRequest<T>(schema: ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: messages };
    }
    return { success: false, error: 'Validation failed' };
  }
}
