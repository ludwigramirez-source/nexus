import { PrismaClient, QuotationStatus, Prisma } from '@prisma/client';
import {
  CreateQuotationDTO,
  UpdateQuotationDTO,
  UpdateQuotationStatusDTO,
  QuotationFilters,
  QuotationResponse,
  QuotationListResponse,
  QuotationItemCalculation,
  QuotationTotals,
  CreateQuotationItemDTO
} from './quotations.types';
import { activityLogsService } from '../activity-logs/activity-logs.service';

const prisma = new PrismaClient();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate quotation number: BAQ-{year}-{consecutive}
 * Format: BAQ-2026-0001, BAQ-2026-0002, etc.
 */
async function generateQuotationNumber(year: number): Promise<string> {
  // Get the last quotation of the year
  const lastQuotation = await prisma.quotation.findFirst({
    where: {
      quotationNumber: {
        startsWith: `BAQ-${year}-`
      }
    },
    orderBy: {
      quotationNumber: 'desc'
    }
  });

  let consecutive = 1;

  if (lastQuotation) {
    // Extract consecutive number from last quotation
    const parts = lastQuotation.quotationNumber.split('-');
    const lastConsecutive = parseInt(parts[2], 10);
    consecutive = lastConsecutive + 1;
  }

  // Format: BAQ-2026-0001
  const quotationNumber = `BAQ-${year}-${consecutive.toString().padStart(4, '0')}`;
  return quotationNumber;
}

/**
 * Calculate item totals (subtotal, tax, total)
 */
function calculateItemTotals(
  quantity: number,
  unitPrice: number,
  discount: number,
  hasVAT: boolean,
  vatRate: number
): QuotationItemCalculation {
  const subtotal = quantity * unitPrice;
  const discountAmount = subtotal * (discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = hasVAT ? subtotalAfterDiscount * (vatRate / 100) : 0;
  const total = subtotalAfterDiscount + taxAmount;

  return {
    subtotal: subtotalAfterDiscount,
    taxAmount,
    total
  };
}

/**
 * Calculate quotation totals from items
 */
function calculateQuotationTotals(items: CreateQuotationItemDTO[], products: any[]): QuotationTotals {
  let subtotal = 0;
  let taxAmount = 0;
  let discountAmount = 0;

  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const itemCalc = calculateItemTotals(
      item.quantity,
      item.unitPrice,
      item.discount || 0,
      product.hasVAT,
      product.vatRate || 0
    );

    subtotal += itemCalc.subtotal;
    taxAmount += itemCalc.taxAmount;
    discountAmount += (item.quantity * item.unitPrice * (item.discount || 0)) / 100;
  });

  return {
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount: subtotal + taxAmount
  };
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const quotationsService = {
  /**
   * Create a new quotation
   */
  async create(data: CreateQuotationDTO, userId: string): Promise<QuotationResponse> {
    // Generate quotation number
    const year = new Date().getFullYear();
    const quotationNumber = await generateQuotationNumber(year);

    // Fetch products to get VAT info
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    // Calculate totals
    const totals = calculateQuotationTotals(data.items, products);

    // Create quotation with items
    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        clientId: data.clientId,
        createdByUserId: userId,
        status: QuotationStatus.DRAFT,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        currency: data.currency || 'USD',
        deliveryTime: data.deliveryTime,
        paymentTerms: data.paymentTerms,
        warranty: data.warranty,
        observations: data.observations,
        internalNotes: data.internalNotes,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.totalAmount,
        quotationItems: {
          create: data.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            const itemCalc = calculateItemTotals(
              item.quantity,
              item.unitPrice,
              item.discount || 0,
              product?.hasVAT || false,
              product?.vatRate || 0
            );

            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              description: item.description,
              discount: item.discount || 0,
              subtotal: itemCalc.subtotal,
              taxAmount: itemCalc.taxAmount,
              total: itemCalc.total,
              recurrence: item.recurrence,
              deliveryTime: item.deliveryTime
            };
          })
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            nit: true,
            email: true,
            contactPerson: true,
            phone: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quotationItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true
              }
            }
          }
        }
      }
    });

    // Log activity
    await activityLogsService.log({
      userId,
      userName: quotation.createdByUser.name,
      userEmail: quotation.createdByUser.email,
      action: 'CREATE',
      entity: 'QUOTATION',
      entityId: quotation.id,
      description: `Cotización ${quotationNumber} creada para cliente ${quotation.client.name}`,
      metadata: {
        quotationNumber,
        clientName: quotation.client.name,
        totalAmount: quotation.totalAmount,
        currency: quotation.currency
      }
    });

    return quotation as QuotationResponse;
  },

  /**
   * Get all quotations with filters
   */
  async getAll(filters: QuotationFilters = {}): Promise<QuotationListResponse[]> {
    const where: Prisma.QuotationWhereInput = {};

    if (filters.status && filters.status !== 'all') {
      where.status = filters.status as QuotationStatus;
    }

    if (filters.clientId && filters.clientId !== 'all') {
      where.clientId = filters.clientId;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }

    if (filters.search) {
      where.OR = [
        { quotationNumber: { contains: filters.search, mode: 'insensitive' } },
        { client: { name: { contains: filters.search, mode: 'insensitive' } } }
      ];
    }

    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        client: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return quotations.map((q) => ({
      id: q.id,
      quotationNumber: q.quotationNumber,
      clientId: q.clientId,
      clientName: q.client.name,
      status: q.status,
      validUntil: q.validUntil || undefined,
      totalAmount: q.totalAmount,
      currency: q.currency,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt
    }));
  },

  /**
   * Get quotation by ID
   */
  async getById(id: string): Promise<QuotationResponse | null> {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            nit: true,
            email: true,
            contactPerson: true,
            phone: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quotationItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true
              }
            }
          }
        }
      }
    });

    return quotation as QuotationResponse | null;
  },

  /**
   * Update quotation
   */
  async update(id: string, data: UpdateQuotationDTO, userId: string): Promise<QuotationResponse> {
    const existingQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: { client: true }
    });

    if (!existingQuotation) {
      throw new Error('Quotation not found');
    }

    // If items are being updated, recalculate totals
    let totals: QuotationTotals | undefined;
    if (data.items) {
      const productIds = data.items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });
      totals = calculateQuotationTotals(data.items, products);
    }

    // Update quotation
    const updateData: Prisma.QuotationUpdateInput = {
      clientId: data.clientId,
      validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      currency: data.currency,
      deliveryTime: data.deliveryTime,
      paymentTerms: data.paymentTerms,
      warranty: data.warranty,
      observations: data.observations,
      internalNotes: data.internalNotes
    };

    if (totals) {
      updateData.subtotal = totals.subtotal;
      updateData.taxAmount = totals.taxAmount;
      updateData.discountAmount = totals.discountAmount;
      updateData.totalAmount = totals.totalAmount;
    }

    // If items are provided, delete old items and create new ones
    if (data.items) {
      await prisma.quotationItem.deleteMany({
        where: { quotationId: id }
      });

      const productIds = data.items.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });

      updateData.quotationItems = {
        create: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const itemCalc = calculateItemTotals(
            item.quantity,
            item.unitPrice,
            item.discount || 0,
            product?.hasVAT || false,
            product?.vatRate || 0
          );

          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            description: item.description,
            discount: item.discount || 0,
            subtotal: itemCalc.subtotal,
            taxAmount: itemCalc.taxAmount,
            total: itemCalc.total,
            recurrence: item.recurrence,
            deliveryTime: item.deliveryTime
          };
        })
      };
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            nit: true,
            email: true,
            contactPerson: true,
            phone: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quotationItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true
              }
            }
          }
        }
      }
    });

    // Log activity
    await activityLogsService.log({
      userId,
      userName: quotation.createdByUser.name,
      userEmail: quotation.createdByUser.email,
      action: 'UPDATE',
      entity: 'QUOTATION',
      entityId: quotation.id,
      description: `Cotización ${quotation.quotationNumber} actualizada`,
      metadata: {
        quotationNumber: quotation.quotationNumber,
        clientName: existingQuotation.client.name
      }
    });

    return quotation as QuotationResponse;
  },

  /**
   * Update quotation status
   */
  async updateStatus(
    id: string,
    data: UpdateQuotationStatusDTO,
    userId: string
  ): Promise<QuotationResponse> {
    const existingQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: { client: true }
    });

    if (!existingQuotation) {
      throw new Error('Quotation not found');
    }

    const updateData: Prisma.QuotationUpdateInput = {
      status: data.status
    };

    // Set timestamp based on status
    if (data.status === QuotationStatus.SENT) {
      updateData.sentAt = new Date();
    } else if (data.status === QuotationStatus.ACCEPTED) {
      updateData.acceptedAt = new Date();
    } else if (data.status === QuotationStatus.REJECTED) {
      updateData.rejectedAt = new Date();
      updateData.rejectionReason = data.rejectionReason;
    }

    const quotation = await prisma.quotation.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            nit: true,
            email: true,
            contactPerson: true,
            phone: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quotationItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                type: true
              }
            }
          }
        }
      }
    });

    // Log activity
    await activityLogsService.log({
      userId,
      userName: quotation.createdByUser.name,
      userEmail: quotation.createdByUser.email,
      action: 'STATUS_CHANGE',
      entity: 'QUOTATION',
      entityId: quotation.id,
      description: `Estado de cotización ${quotation.quotationNumber} cambiado a ${data.status}`,
      metadata: {
        quotationNumber: quotation.quotationNumber,
        clientName: existingQuotation.client.name,
        oldStatus: existingQuotation.status,
        newStatus: data.status
      }
    });

    return quotation as QuotationResponse;
  },

  /**
   * Delete quotation
   */
  async delete(id: string, userId: string): Promise<void> {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    await prisma.quotation.delete({
      where: { id }
    });

    // Log activity
    await activityLogsService.log({
      userId,
      userName: quotation.createdByUser.name,
      userEmail: quotation.createdByUser.email,
      action: 'DELETE',
      entity: 'QUOTATION',
      entityId: id,
      description: `Cotización ${quotation.quotationNumber} eliminada`,
      metadata: {
        quotationNumber: quotation.quotationNumber,
        clientName: quotation.client.name
      }
    });
  },

  /**
   * Duplicate quotation
   */
  async duplicate(id: string, userId: string): Promise<QuotationResponse> {
    const originalQuotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        quotationItems: true
      }
    });

    if (!originalQuotation) {
      throw new Error('Quotation not found');
    }

    // Create new quotation based on original
    const createData: CreateQuotationDTO = {
      clientId: originalQuotation.clientId,
      validUntil: originalQuotation.validUntil || undefined,
      currency: originalQuotation.currency,
      deliveryTime: originalQuotation.deliveryTime || undefined,
      paymentTerms: originalQuotation.paymentTerms || undefined,
      warranty: originalQuotation.warranty || undefined,
      observations: originalQuotation.observations || undefined,
      internalNotes: originalQuotation.internalNotes || undefined,
      items: originalQuotation.quotationItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        description: item.description || undefined,
        discount: item.discount,
        recurrence: item.recurrence || undefined,
        deliveryTime: item.deliveryTime || undefined
      }))
    };

    const newQuotation = await this.create(createData, userId);

    // Log activity
    await activityLogsService.log({
      userId,
      userName: newQuotation.createdByUser.name,
      userEmail: newQuotation.createdByUser.email,
      action: 'CREATE',
      entity: 'QUOTATION',
      entityId: newQuotation.id,
      description: `Cotización ${newQuotation.quotationNumber} duplicada desde ${originalQuotation.quotationNumber}`,
      metadata: {
        originalQuotationNumber: originalQuotation.quotationNumber,
        newQuotationNumber: newQuotation.quotationNumber
      }
    });

    return newQuotation;
  },

  async sendEmail(
    id: string,
    emailData: {
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      body: string;
      pdfAttachment?: {
        filename: string;
        content: string; // base64
      };
    }
  ): Promise<void> {
    const { EmailService } = await import('../../utils/emailService');
    const { SystemConfigService } = await import('../system-config/system-config.service');

    // Get quotation with all details
    const quotation = await this.getById(id);

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    // Format email body with proper HTML
    const htmlBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          ${emailData.body.replace(/\n/g, '<br>')}
          <br><br>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Este correo fue enviado desde el sistema Nexus - IPTEGRA SAS<br>
            Para ver la cotización completa, descargue el archivo PDF adjunto.
          </p>
        </body>
      </html>
    `;

    // Prepare attachments
    const attachments = [];
    if (emailData.pdfAttachment) {
      console.log('PDF attachment received:', {
        filename: emailData.pdfAttachment.filename,
        contentLength: emailData.pdfAttachment.content?.length
      });
      attachments.push({
        filename: emailData.pdfAttachment.filename,
        content: Buffer.from(emailData.pdfAttachment.content, 'base64'),
        contentType: 'application/pdf'
      });
    } else {
      console.log('No PDF attachment received in emailData');
    }

    console.log('Sending email with attachments:', attachments.length);

    await EmailService.sendEmail({
      to: emailData.to,
      cc: emailData.cc,
      bcc: emailData.bcc,
      subject: emailData.subject,
      html: htmlBody,
      text: emailData.body,
      attachments
    });

    // Update quotation status to SENT if it was DRAFT
    if (quotation.status === 'DRAFT') {
      await prisma.quotation.update({
        where: { id },
        data: {
          status: 'SENT',
          sentAt: new Date()
        }
      });
    }

    // Log activity
    await activityLogsService.log({
      userId: quotation.createdByUserId,
      userName: quotation.createdByUser.name,
      userEmail: quotation.createdByUser.email,
      action: 'UPDATE',
      entity: 'QUOTATION',
      entityId: quotation.id,
      description: `Cotización ${quotation.quotationNumber} enviada por correo a ${emailData.to}`,
      metadata: {
        quotationNumber: quotation.quotationNumber,
        recipientEmail: emailData.to
      }
    });
  },

  /**
   * Get quotations grouped by status for Kanban board (Sales Funnel)
   * Excludes DRAFT status
   */
  async getKanbanData(filters?: {
    clientId?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    currency?: string;
    search?: string;
  }): Promise<{
    columns: Array<{
      status: string;
      label: string;
      totalAmount: number;
      count: number;
      quotations: Array<QuotationResponse>;
    }>;
  }> {
    // Build where clause
    const where: any = {
      status: {
        not: 'DRAFT' // Exclude drafts from funnel
      }
    };

    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }

    if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
      where.totalAmount = {};
      if (filters.minAmount !== undefined) {
        where.totalAmount.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.totalAmount.lte = filters.maxAmount;
      }
    }

    if (filters?.currency) {
      where.currency = filters.currency;
    }

    if (filters?.search) {
      where.OR = [
        { quotationNumber: { contains: filters.search, mode: 'insensitive' } },
        { client: { name: { contains: filters.search, mode: 'insensitive' } } }
      ];
    }

    // Get all quotations for the funnel
    const quotations = await prisma.quotation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            tier: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Define kanban columns in order
    const columnDefinitions = [
      { status: 'SENT', label: 'Enviadas' },
      { status: 'NEGOTIATING', label: 'En Negociación' },
      { status: 'ACCEPTED', label: 'Aceptadas' },
      { status: 'CONVERTED_TO_ORDER', label: 'Convertidas' },
      { status: 'REJECTED', label: 'Rechazadas' },
      { status: 'EXPIRED', label: 'Expiradas' }
    ];

    // Group quotations by status
    const columns = columnDefinitions.map(columnDef => {
      const columnQuotations = quotations.filter(q => q.status === columnDef.status);
      const totalAmount = columnQuotations.reduce((sum, q) => sum + Number(q.totalAmount), 0);

      return {
        status: columnDef.status,
        label: columnDef.label,
        totalAmount,
        count: columnQuotations.length,
        quotations: columnQuotations.map(q => ({
          ...q,
          clientName: q.client.name
        })) as QuotationResponse[]
      };
    });

    return { columns };
  }
};
