import type { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.types';
import { successResponse, errorResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import { getSessionData } from '../../utils/request.util';
import logger from '../../config/logger';

export class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request
      const validatedData = validateRequest(registerSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      // Register user
      const result = await AuthService.register(validatedData, sessionData);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      logger.error('Register error:', error);
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request
      const validatedData = validateRequest(loginSchema, req.body);

      // Get session data for activity logging
      const sessionData = getSessionData(req);

      // Login user
      const result = await AuthService.login(validatedData, sessionData);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      successResponse(res, result, 'Login successful', 200);
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        errorResponse(res, 'Refresh token is required', 401);
        return;
      }

      // Validate refresh token
      validateRequest(refreshTokenSchema, { refreshToken });

      // Refresh tokens
      const result = await AuthService.refresh(refreshToken);

      // Set new refresh token in httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      successResponse(res, result, 'Token refreshed successfully', 200);
    } catch (error) {
      logger.error('Refresh error:', error);
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        // Logout user
        await AuthService.logout(refreshToken);

        // Clear refresh token cookie
        res.clearCookie('refreshToken');
      }

      successResponse(res, null, 'Logout successful', 200);
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  static async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get user ID from authenticated request
      const userId = req.user?.userId;

      if (!userId) {
        errorResponse(res, 'Unauthorized', 401);
        return;
      }

      // Get current user
      const user = await AuthService.getCurrentUser(userId);

      successResponse(res, user, 'User retrieved successfully', 200);
    } catch (error) {
      logger.error('Get current user error:', error);
      next(error);
    }
  }
}
