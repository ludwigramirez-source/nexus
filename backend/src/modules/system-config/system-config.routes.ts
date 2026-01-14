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

// ============================================
// COMPANY CONFIGURATION ROUTES
// ============================================

/**
 * @route   GET /api/system-config/company
 * @desc    Get company configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.get('/company', SystemConfigController.getCompanyConfig);

/**
 * @route   PUT /api/system-config/company
 * @desc    Update company configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/company', SystemConfigController.updateCompanyConfig);

/**
 * @route   GET /api/system-config/all
 * @desc    Get all system configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.get('/all', SystemConfigController.getAllConfig);

/**
 * @route   PUT /api/system-config/general
 * @desc    Update general configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/general', SystemConfigController.updateGeneralConfig);

/**
 * @route   PUT /api/system-config/products
 * @desc    Update products configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/products', SystemConfigController.updateProductsConfig);

/**
 * @route   PUT /api/system-config/clients
 * @desc    Update clients configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/clients', SystemConfigController.updateClientsConfig);

/**
 * @route   PUT /api/system-config/okrs
 * @desc    Update OKRs configuration
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.put('/okrs', SystemConfigController.updateOkrsConfig);

/**
 * @route   POST /api/system-config/test-email-connection
 * @desc    Test SMTP connection
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.post('/test-email-connection', SystemConfigController.testEmailConnection);

/**
 * @route   POST /api/system-config/send-test-email
 * @desc    Send test email
 * @access  Private (CEO, DEV_DIRECTOR)
 */
router.post('/send-test-email', SystemConfigController.sendTestEmail);

export default router;
