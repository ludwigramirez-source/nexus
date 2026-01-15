import { Router } from 'express';
import { quotationsController } from './quotations.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/quotations
 * Create a new quotation
 */
router.post('/', quotationsController.create);

/**
 * GET /api/quotations
 * Get all quotations with filters
 * Query params: status, clientId, dateFrom, dateTo, search
 */
router.get('/', quotationsController.getAll);

/**
 * GET /api/quotations/kanban
 * Get quotations grouped by status for Kanban board (Sales Funnel)
 * Query params: clientId, dateFrom, dateTo, minAmount, maxAmount, currency, search
 */
router.get('/kanban', quotationsController.getKanbanData);

/**
 * GET /api/quotations/:id
 * Get quotation by ID
 */
router.get('/:id', quotationsController.getById);

/**
 * PUT /api/quotations/:id
 * Update quotation
 */
router.put('/:id', quotationsController.update);

/**
 * PATCH /api/quotations/:id/status
 * Update quotation status
 */
router.patch('/:id/status', quotationsController.updateStatus);

/**
 * DELETE /api/quotations/:id
 * Delete quotation
 */
router.delete('/:id', quotationsController.delete);

/**
 * POST /api/quotations/:id/duplicate
 * Duplicate quotation
 */
router.post('/:id/duplicate', quotationsController.duplicate);

/**
 * GET /api/quotations/:id/pdf
 * Generate PDF for quotation
 */
router.get('/:id/pdf', quotationsController.generatePDF);

/**
 * POST /api/quotations/:id/send-email
 * Send quotation via email with PDF attachment
 */
router.post('/:id/send-email', quotationsController.sendEmail);

export default router;
