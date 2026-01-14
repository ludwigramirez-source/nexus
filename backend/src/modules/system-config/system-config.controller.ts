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

  // ============================================
  // COMPANY CONFIGURATION
  // ============================================

  /**
   * Get company configuration
   * GET /api/system-config/company
   */
  static async getCompanyConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.getCompanyConfig();
      successResponse(res, config, 'Company config retrieved successfully', 200);
    } catch (error) {
      logger.error('Get company config error:', error);
      next(error);
    }
  }

  /**
   * Update company configuration
   * PUT /api/system-config/company
   */
  static async updateCompanyConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.updateCompanyConfig(req.body);
      successResponse(res, config, 'Company config updated successfully', 200);
    } catch (error) {
      logger.error('Update company config error:', error);
      next(error);
    }
  }

  /**
   * Get all system configuration
   * GET /api/system-config/all
   */
  static async getAllConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.getAllConfig();
      successResponse(res, config, 'All config retrieved successfully', 200);
    } catch (error) {
      logger.error('Get all config error:', error);
      next(error);
    }
  }

  /**
   * Update general configuration
   * PUT /api/system-config/general
   */
  static async updateGeneralConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.updateGeneralConfig(req.body);
      successResponse(res, config, 'General config updated successfully', 200);
    } catch (error) {
      logger.error('Update general config error:', error);
      next(error);
    }
  }

  /**
   * Update products configuration
   * PUT /api/system-config/products
   */
  static async updateProductsConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.updateProductsConfig(req.body);
      successResponse(res, config, 'Products config updated successfully', 200);
    } catch (error) {
      logger.error('Update products config error:', error);
      next(error);
    }
  }

  /**
   * Update clients configuration
   * PUT /api/system-config/clients
   */
  static async updateClientsConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.updateClientsConfig(req.body);
      successResponse(res, config, 'Clients config updated successfully', 200);
    } catch (error) {
      logger.error('Update clients config error:', error);
      next(error);
    }
  }

  /**
   * Update OKRs configuration
   * PUT /api/system-config/okrs
   */
  static async updateOkrsConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await SystemConfigService.updateOkrsConfig(req.body);
      successResponse(res, config, 'OKRs config updated successfully', 200);
    } catch (error) {
      logger.error('Update OKRs config error:', error);
      next(error);
    }
  }

  /**
   * Test SMTP connection
   * POST /api/system-config/test-email-connection
   */
  static async testEmailConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { EmailService } = await import('../../utils/emailService');
      const result = await EmailService.testConnection();

      if (result.success) {
        successResponse(res, result, result.message, 200);
      } else {
        res.status(400).json({ error: result.message });
      }
    } catch (error) {
      logger.error('Test email connection error:', error);
      res.status(500).json({
        error: 'Error al probar la conexión SMTP',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Send test email
   * POST /api/system-config/send-test-email
   */
  static async sendTestEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { to } = req.body;

      if (!to) {
        res.status(400).json({ error: 'El campo "to" es requerido' });
        return;
      }

      const { EmailService } = await import('../../utils/emailService');
      await EmailService.sendTestEmail(to);

      successResponse(res, { to }, 'Correo de prueba enviado exitosamente', 200);
    } catch (error) {
      logger.error('Send test email error:', error);
      res.status(500).json({
        error: 'Error al enviar el correo de prueba',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
