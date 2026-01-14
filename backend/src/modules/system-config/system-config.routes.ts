import { Router } from 'express';
import { SystemConfigController } from './system-config.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication and CEO/DEV_DIRECTOR authorization
router.use(authenticate);
router.use(authorize(['CEO', 'DEV_DIRECTOR']));

// ============================================
// ROLES ROUTES
// ============================================

/**
 * @route   GET /api/system-config/roles
 * @desc    Get all roles
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.get('/roles', SystemConfigController.getAllRoles);

/**
 * @route   POST /api/system-config/roles
 * @desc    Create a new role
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.post('/roles', SystemConfigController.createRole);

/**
 * @route   PUT /api/system-config/roles/:id
 * @desc    Update a role
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/roles/:id', SystemConfigController.updateRole);

/**
 * @route   DELETE /api/system-config/roles/:id
 * @desc    Delete a role
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.delete('/roles/:id', SystemConfigController.deleteRole);

// ============================================
// SKILLS ROUTES
// ============================================

/**
 * @route   GET /api/system-config/skills
 * @desc    Get all skills
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.get('/skills', SystemConfigController.getAllSkills);

/**
 * @route   POST /api/system-config/skills
 * @desc    Create a new skill
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.post('/skills', SystemConfigController.createSkill);

/**
 * @route   PUT /api/system-config/skills/:id
 * @desc    Update a skill
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/skills/:id', SystemConfigController.updateSkill);

/**
 * @route   DELETE /api/system-config/skills/:id
 * @desc    Delete a skill
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.delete('/skills/:id', SystemConfigController.deleteSkill);

export default router;
