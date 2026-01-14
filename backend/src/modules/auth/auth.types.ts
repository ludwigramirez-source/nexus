import { z } from 'zod';
import { UserStatus } from '@prisma/client';

// ============================================================================
// Validation Schemas
// ============================================================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.string().min(1, 'Role is required'),
  avatar: z.string().url().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================================================
// DTOs
// ============================================================================

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: AuthTokens;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// JWT Payload
// ============================================================================

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// ============================================================================
// Session Types
// ============================================================================

export interface SessionData {
  userId: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
}
