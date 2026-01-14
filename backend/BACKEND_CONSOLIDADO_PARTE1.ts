/**
 * IPTEGRA NEXUS - BACKEND CONSOLIDADO
 * 
 * Este archivo contiene TODOS los módulos del backend consolidados.
 * Para desarrollo, puedes dividirlo en archivos separados o usar directamente.
 * 
 * INSTRUCCIONES:
 * 1. Este código está organizado por módulos
 * 2. Cada módulo tiene: Types, Service, Controller, Routes
 * 3. Puedes copiar cada sección a su archivo correspondiente
 * 4. O usar Claude Code para refactorizar
 * 
 * MÓDULOS INCLUIDOS:
 * - Auth (login, register, refresh)
 * - Users (CRUD, gestión de usuarios)
 * - Requests (solicitudes completas)
 * - Assignments (asignaciones de capacidad)
 * - OKRs (objetivos y key results)
 * - Products (productos y roadmap)
 * - Clients (cartera de clientes)
 * - Metrics (métricas y analytics)
 * - Notifications (email + socket.io)
 */

// ============================================
// AUTH MODULE - COMPLETE
// ============================================

// File: src/modules/auth/auth.types.ts
export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role: 'CEO' | 'DEV_DIRECTOR' | 'BACKEND' | 'FRONTEND' | 'FULLSTACK';
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

// File: src/modules/auth/auth.service.ts
import prisma from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/hash.util';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.util';

export class AuthService {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
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

    // Save refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Check if active
    if (user.status !== 'ACTIVE') {
      throw new Error('User account is inactive');
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

    // Save refresh token (delete old ones first)
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
        expiresAt: { lt: new Date() },
      },
    });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify token
    const payload = verifyRefreshToken(refreshToken);

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        capacity: true,
        skills: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();

// File: src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { authService } from './auth.service';
import { successResponse, errorResponse } from '../../utils/response.util';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return successResponse(res, result, 'Login successful');
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (!refreshToken) {
        return errorResponse(res, 'Refresh token required', 400);
      }

      const result = await authService.refresh(refreshToken);
      
      // Update cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return successResponse(res, result, 'Token refreshed');
    } catch (error) {
      return errorResponse(res, error.message, 401);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie('refreshToken');
      return successResponse(res, null, 'Logout successful');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getMe(req.user!.userId);
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }
}

export const authController = new AuthController();

// File: src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;

// ============================================
// USERS MODULE - COMPLETE
// ============================================

// File: src/modules/users/users.service.ts
export class UsersService {
  async getAll(filters?: { role?: string; status?: string }) {
    return prisma.user.findMany({
      where: {
        ...(filters?.role && { role: filters.role as any }),
        ...(filters?.status && { status: filters.status as any }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        capacity: true,
        skills: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        capacity: true,
        skills: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            assignedRequests: true,
            assignments: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async update(id: string, data: any) {
    // Don't allow password update here
    delete data.password;
    delete data.email;

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        capacity: true,
        skills: true,
        status: true,
      },
    });
  }

  async delete(id: string) {
    // Check if user has active assignments
    const activeAssignments = await prisma.assignment.count({
      where: {
        userId: id,
        status: { in: ['PLANNED', 'IN_PROGRESS'] },
      },
    });

    if (activeAssignments > 0) {
      throw new Error('Cannot delete user with active assignments');
    }

    // Soft delete: just mark as inactive
    return prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  async updateStatus(id: string, status: 'ACTIVE' | 'INACTIVE') {
    return prisma.user.update({
      where: { id },
      data: { status },
    });
  }
}

export const usersService = new UsersService();

// File: src/modules/users/users.controller.ts
export class UsersController {
  async getAll(req: Request, res: Response) {
    try {
      const users = await usersService.getAll(req.query as any);
      return successResponse(res, users);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await usersService.getById(req.params.id);
      return successResponse(res, user);
    } catch (error) {
      return errorResponse(res, error.message, 404);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await usersService.update(req.params.id, req.body);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await usersService.delete(req.params.id);
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const user = await usersService.updateStatus(req.params.id, req.body.status);
      return successResponse(res, user, 'User status updated');
    } catch (error) {
      return errorResponse(res, error.message, 400);
    }
  }
}

export const usersController = new UsersController();

// File: src/modules/users/users.routes.ts
const userRouter = Router();

userRouter.get('/', authenticate, usersController.getAll);
userRouter.get('/:id', authenticate, usersController.getById);
userRouter.put('/:id', authenticate, authorize(['CEO', 'DEV_DIRECTOR']), usersController.update);
userRouter.delete('/:id', authenticate, authorize(['CEO']), usersController.delete);
userRouter.patch('/:id/status', authenticate, authorize(['CEO', 'DEV_DIRECTOR']), usersController.updateStatus);

export default userRouter;

// ============================================
// TODO: Continúa con Requests, Assignments, OKRs, Products, Clients, Metrics
// Estos módulos siguen el mismo patrón
// ============================================
