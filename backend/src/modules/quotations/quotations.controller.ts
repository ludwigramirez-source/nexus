import { Request, Response } from 'express';
import { quotationsService } from './quotations.service';
import { QuotationStatus } from '@prisma/client';
import {
  CreateQuotationDTO,
  UpdateQuotationDTO,
  UpdateQuotationStatusDTO,
  QuotationFilters
} from './quotations.types';

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

export const quotationsController = {
  /**
   * POST /api/quotations
   * Create a new quotation
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const data: CreateQuotationDTO = req.body;

      // Validate required fields
      if (!data.clientId || !data.items || data.items.length === 0) {
        res.status(400).json({
          error: 'clientId e items son requeridos'
        });
        return;
      }

      const quotation = await quotationsService.create(data, userId);

      res.status(201).json(quotation);
    } catch (error) {
      console.error('Error creating quotation:', error);
      res.status(500).json({
        error: 'Error al crear la cotización',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * GET /api/quotations
   * Get all quotations with filters
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: QuotationFilters = {
        status: req.query.status as QuotationStatus | 'all' | undefined,
        clientId: req.query.clientId as string | undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        search: req.query.search as string | undefined
      };

      const quotations = await quotationsService.getAll(filters);

      res.status(200).json(quotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      res.status(500).json({
        error: 'Error al obtener las cotizaciones',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * GET /api/quotations/:id
   * Get quotation by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const quotation = await quotationsService.getById(id);

      if (!quotation) {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }

      res.status(200).json(quotation);
    } catch (error) {
      console.error('Error fetching quotation:', error);
      res.status(500).json({
        error: 'Error al obtener la cotización',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * PUT /api/quotations/:id
   * Update quotation
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;
      const data: UpdateQuotationDTO = req.body;

      const quotation = await quotationsService.update(id, data, userId);

      res.status(200).json(quotation);
    } catch (error) {
      console.error('Error updating quotation:', error);
      if (error instanceof Error && error.message === 'Quotation not found') {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }
      res.status(500).json({
        error: 'Error al actualizar la cotización',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * PATCH /api/quotations/:id/status
   * Update quotation status
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;
      const data: UpdateQuotationStatusDTO = req.body;

      if (!data.status) {
        res.status(400).json({ error: 'El campo status es requerido' });
        return;
      }

      const quotation = await quotationsService.updateStatus(id, data, userId);

      res.status(200).json(quotation);
    } catch (error) {
      console.error('Error updating quotation status:', error);
      if (error instanceof Error && error.message === 'Quotation not found') {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }
      res.status(500).json({
        error: 'Error al actualizar el estado de la cotización',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * DELETE /api/quotations/:id
   * Delete quotation
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;

      await quotationsService.delete(id, userId);

      res.status(200).json({ message: 'Cotización eliminada exitosamente' });
    } catch (error) {
      console.error('Error deleting quotation:', error);
      if (error instanceof Error && error.message === 'Quotation not found') {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }
      res.status(500).json({
        error: 'Error al eliminar la cotización',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * POST /api/quotations/:id/duplicate
   * Duplicate quotation
   */
  async duplicate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }

      const { id } = req.params;

      const quotation = await quotationsService.duplicate(id, userId);

      res.status(201).json(quotation);
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      if (error instanceof Error && error.message === 'Quotation not found') {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }
      res.status(500).json({
        error: 'Error al duplicar la cotización',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * GET /api/quotations/:id/pdf
   * Generate PDF for quotation
   * TODO: Implement PDF generation in Sprint 4
   */
  async generatePDF(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const quotation = await quotationsService.getById(id);

      if (!quotation) {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }

      // TODO: Implement PDF generation using jsPDF or pdfmake
      // For now, return a placeholder response
      res.status(501).json({
        message: 'Generación de PDF será implementada en Sprint 4',
        quotation
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({
        error: 'Error al generar el PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * POST /api/quotations/:id/send-email
   * Send quotation via email with PDF attachment
   */
  async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { to, cc, bcc, subject, body, pdfAttachment } = req.body;

      if (!to) {
        res.status(400).json({ error: 'El campo "to" es requerido' });
        return;
      }

      if (!subject || !body) {
        res.status(400).json({ error: 'El asunto y el cuerpo del correo son requeridos' });
        return;
      }

      const quotation = await quotationsService.getById(id);

      if (!quotation) {
        res.status(404).json({ error: 'Cotización no encontrada' });
        return;
      }

      // Send email with PDF attachment
      await quotationsService.sendEmail(id, { to, cc, bcc, subject, body, pdfAttachment });

      res.json({
        success: true,
        message: 'Correo enviado exitosamente'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({
        error: 'Error al enviar el correo',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
