import { QuotationStatus, BillingRecurrence } from '@prisma/client';

// ============================================
// CREATE DTOs
// ============================================

export interface CreateQuotationItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  discount?: number;
  recurrence?: BillingRecurrence;
  deliveryTime?: string;
}

export interface CreateQuotationDTO {
  clientId: string;
  validUntil?: Date | string;
  currency?: string;
  deliveryTime?: string;
  paymentTerms?: string;
  warranty?: string;
  observations?: string;
  internalNotes?: string;
  items: CreateQuotationItemDTO[];
}

// ============================================
// UPDATE DTOs
// ============================================

export interface UpdateQuotationDTO {
  validUntil?: Date | string;
  status?: QuotationStatus;
  deliveryTime?: string;
  paymentTerms?: string;
  warranty?: string;
  observations?: string;
  internalNotes?: string;
  items?: CreateQuotationItemDTO[];
}

export interface UpdateQuotationStatusDTO {
  status: QuotationStatus;
  rejectionReason?: string;
}

// ============================================
// FILTERS
// ============================================

export interface QuotationFilters {
  status?: QuotationStatus | 'all';
  clientId?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  search?: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface QuotationItemResponse {
  id: string;
  quotationId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description?: string;
    type: string;
  };
  quantity: number;
  unitPrice: number;
  description?: string;
  discount: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  recurrence?: BillingRecurrence;
  deliveryTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationResponse {
  id: string;
  quotationNumber: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    nit?: string;
    email?: string;
    contactPerson?: string;
    phone?: string;
  };
  createdByUserId: string;
  createdByUser: {
    id: string;
    name: string;
    email: string;
  };
  status: QuotationStatus;
  validUntil?: Date;
  totalAmount: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  deliveryTime?: string;
  paymentTerms?: string;
  warranty?: string;
  observations?: string;
  internalNotes?: string;
  sentAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  quotationItems: QuotationItemResponse[];
}

export interface QuotationListResponse {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  status: QuotationStatus;
  validUntil?: Date;
  totalAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// CALCULATION TYPES
// ============================================

export interface QuotationItemCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface QuotationTotals {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}
