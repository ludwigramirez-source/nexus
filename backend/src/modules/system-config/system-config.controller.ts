import type { Request, Response, NextFunction } from 'express';
import { SystemConfigService } from './system-config.service';
import { createRoleSchema, updateRoleSchema, createSkillSchema, updateSkillSchema } from './system-config.types';
import { successResponse } from '../../utils/response.util';
import { validateRequest } from '../../utils/validation.util';
import logger from '../../config/logger';

export class SystemConfigController {
  // ============================================
  // ROLES
  // ============================================

  /**
   * Get all roles
   * GET /api/system-config/roles
   */
  static async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await SystemConfigService.getAllRoles();
      successResponse(res, { roles }, 'Roles retrieved successfully', 200);
    } catch (error) {
      logger.error('Get roles error:', error);
      next(error);
    }
  }

  /**
   * Create a new role
   * POST /api/system-config/roles
   */
  static async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(createRoleSchema, req.body);
      const role = await SystemConfigService.createRole(validatedData);
      successResponse(res, role, 'Role created successfully', 201);
    } catch (error) {
      logger.error('Create role error:', error);
      next(error);
    }
  }

  /**
   * Update a role
   * PUT /api/system-config/roles/:id
   */
  static async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateRoleSchema, req.body);
      const role = await SystemConfigService.updateRole(id, validatedData);
      successResponse(res, role, 'Role updated successfully', 200);
    } catch (error) {
      logger.error('Update role error:', error);
      next(error);
    }
  }

  /**
   * Delete a role
   * DELETE /api/system-config/roles/:id
   */
  static async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await SystemConfigService.deleteRole(id);
      successResponse(res, null, 'Role deleted successfully', 200);
    } catch (error) {
      logger.error('Delete role error:', error);
      next(error);
    }
  }

  // ============================================
  // SKILLS
  // ============================================

  /**
   * Get all skills
   * GET /api/system-config/skills
   */
  static async getAllSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skills = await SystemConfigService.getAllSkills();
      successResponse(res, { skills }, 'Skills retrieved successfully', 200);
    } catch (error) {
      logger.error('Get skills error:', error);
      next(error);
    }
  }

  /**
   * Create a new skill
   * POST /api/system-config/skills
   */
  static async createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = validateRequest(createSkillSchema, req.body);
      const skill = await SystemConfigService.createSkill(validatedData);
      successResponse(res, skill, 'Skill created successfully', 201);
    } catch (error) {
      logger.error('Create skill error:', error);
      next(error);
    }
  }

  /**
   * Update a skill
   * PUT /api/system-config/skills/:id
   */
  static async updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = validateRequest(updateSkillSchema, req.body);
      const skill = await SystemConfigService.updateSkill(id, validatedData);
      successResponse(res, skill, 'Skill updated successfully', 200);
    } catch (error) {
      logger.error('Update skill error:', error);
      next(error);
    }
  }

  /**
   * Delete a skill
   * DELETE /api/system-config/skills/:id
   */
  static async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await SystemConfigService.deleteSkill(id);
      successResponse(res, null, 'Skill deleted successfully', 200);
    } catch (error) {
      logger.error('Delete skill error:', error);
      next(error);
    }
  }
}
