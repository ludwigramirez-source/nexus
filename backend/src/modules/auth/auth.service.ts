import bcrypt from 'bcrypt';
import prisma from '../../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.util';
import { AppError } from '../../utils/errors.util';
import { assertValidRole } from '../../utils/role-validator.util';
import logger from '../../config/logger';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { RegisterDTO, LoginDTO, AuthResponse, UserResponse, SessionData } from './auth.types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterDTO, sessionData?: Partial<SessionData>): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Validate that the role exists in system_config
      await assertValidRole(data.role);

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
          avatar: data.avatar,
          status: 'ACTIVE',
        },
      });

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Delete old sessions for this user to avoid duplicates
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // Store refresh token in database
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      logger.info(`User registered successfully: ${user.email}`);

      // Log activity
      await ActivityLogsService.create({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: 'REGISTER',
        entity: 'USER',
        entityId: user.id,
        description: `New user registered: ${user.name} (${user.email})`,
        metadata: { role: user.role },
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return {
        user: this.formatUserResponse(user),
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      logger.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginDTO, sessionData?: Partial<SessionData>): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        throw new AppError('User account is not active', 403);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Delete old sessions for this user to avoid duplicates
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      // Store refresh token in database
      await prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      logger.info(`User logged in successfully: ${user.email}`);

      // Log activity
      await ActivityLogsService.create({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        action: 'LOGIN',
        entity: 'USER',
        entityId: user.id,
        description: `User logged in: ${user.name}`,
        ipAddress: sessionData?.ipAddress,
        userAgent: sessionData?.userAgent,
      });

      return {
        user: this.formatUserResponse(user),
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      logger.error('Error during login:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(token);

      // Find session
      const session = await prisma.session.findFirst({
        where: {
          refreshToken: token,
          userId: payload.userId,
        },
        include: {
          user: true,
        },
      });

      if (!session) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await prisma.session.delete({
          where: { id: session.id },
        });
        throw new AppError('Refresh token expired', 401);
      }

      // Check if user is active
      if (session.user.status !== 'ACTIVE') {
        throw new AppError('User account is not active', 403);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });

      // Update session with new refresh token
      await prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      logger.info(`Token refreshed for user: ${session.user.email}`);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error('Error during token refresh:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(refreshToken: string): Promise<void> {
    try {
      // Find session to get user info before deleting
      const session = await prisma.session.findFirst({
        where: { refreshToken },
        include: { user: true },
      });

      // Delete session
      await prisma.session.deleteMany({
        where: { refreshToken },
      });

      logger.info('User logged out successfully');

      // Log activity if we found the session
      if (session?.user) {
        await ActivityLogsService.create({
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          action: 'LOGOUT',
          entity: 'USER',
          entityId: session.user.id,
          description: `User logged out: ${session.user.name}`,
        });
      }
    } catch (error) {
      logger.error('Error during logout:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(userId: string): Promise<UserResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.status !== 'ACTIVE') {
        throw new AppError('User account is not active', 403);
      }

      return this.formatUserResponse(user);
    } catch (error) {
      logger.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Format user response (exclude password)
   */
  private static formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
