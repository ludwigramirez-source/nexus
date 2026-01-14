import { QuotationStatus, BillingRecurrence } from '@prisma/client';
import { CreateQuotationDTO, UpdateQuotationDTO, CreateQuotationItemDTO } from './quotations.types';

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate quotation item
 */
export function validateQuotationItem(item: CreateQuotationItemDTO): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.productId || typeof item.productId !== 'string') {
    errors.push('productId es requerido y debe ser un string');
  }

  if (typeof item.quantity !== 'number' || item.quantity <= 0) {
    errors.push('quantity debe ser un número mayor a 0');
  }

  if (typeof item.unitPrice !== 'number' || item.unitPrice < 0) {
    errors.push('unitPrice debe ser un número mayor o igual a 0');
  }

  if (item.discount !== undefined) {
    if (typeof item.discount !== 'number' || item.discount < 0 || item.discount > 100) {
      errors.push('discount debe ser un número entre 0 y 100');
    }
  }

  if (item.recurrence !== undefined) {
    const validRecurrences = Object.values(BillingRecurrence);
    if (!validRecurrences.includes(item.recurrence)) {
      errors.push(`recurrence debe ser uno de: ${validRecurrences.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate create quotation DTO
 */
export function validateCreateQuotation(data: CreateQuotationDTO): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.clientId || typeof data.clientId !== 'string') {
    errors.push('clientId es requerido y debe ser un string');
  }

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('items es requerido y debe ser un array con al menos un elemento');
  } else {
    // Validate each item
    data.items.forEach((item, index) => {
      const itemValidation = validateQuotationItem(item);
      if (!itemValidation.valid) {
        errors.push(`Item ${index + 1}: ${itemValidation.errors.join(', ')}`);
      }
    });
  }

  // Optional fields validation
  if (data.validUntil) {
    const validUntil = new Date(data.validUntil);
    const now = new Date();
    if (isNaN(validUntil.getTime())) {
      errors.push('validUntil debe ser una fecha válida');
    } else if (validUntil < now) {
      errors.push('validUntil debe ser una fecha futura');
    }
  }

  if (data.currency && typeof data.currency !== 'string') {
    errors.push('currency debe ser un string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate update quotation DTO
 */
export function validateUpdateQuotation(data: UpdateQuotationDTO): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate items if provided
  if (data.items !== undefined) {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      errors.push('items debe ser un array con al menos un elemento');
    } else {
      data.items.forEach((item, index) => {
        const itemValidation = validateQuotationItem(item);
        if (!itemValidation.valid) {
          errors.push(`Item ${index + 1}: ${itemValidation.errors.join(', ')}`);
        }
      });
    }
  }

  // Validate validUntil if provided
  if (data.validUntil) {
    const validUntil = new Date(data.validUntil);
    if (isNaN(validUntil.getTime())) {
      errors.push('validUntil debe ser una fecha válida');
    }
  }

  // Validate status if provided
  if (data.status !== undefined) {
    const validStatuses = Object.values(QuotationStatus);
    if (!validStatuses.includes(data.status)) {
      errors.push(`status debe ser uno de: ${validStatuses.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate quotation status
 */
export function validateQuotationStatus(status: QuotationStatus): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validStatuses = Object.values(QuotationStatus);

  if (!validStatuses.includes(status)) {
    errors.push(`status debe ser uno de: ${validStatuses.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate status transition
 * Ensures valid state machine transitions
 */
export function validateStatusTransition(
  currentStatus: QuotationStatus,
  newStatus: QuotationStatus
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Define valid transitions
  const validTransitions: Record<QuotationStatus, QuotationStatus[]> = {
    [QuotationStatus.DRAFT]: [
      QuotationStatus.SENT,
      QuotationStatus.REJECTED
    ],
    [QuotationStatus.SENT]: [
      QuotationStatus.ACCEPTED,
      QuotationStatus.REJECTED,
      QuotationStatus.EXPIRED
    ],
    [QuotationStatus.ACCEPTED]: [
      QuotationStatus.CONVERTED_TO_ORDER
    ],
    [QuotationStatus.REJECTED]: [],
    [QuotationStatus.EXPIRED]: [
      QuotationStatus.SENT
    ],
    [QuotationStatus.CONVERTED_TO_ORDER]: []
  };

  const allowedTransitions = validTransitions[currentStatus] || [];

  if (!allowedTransitions.includes(newStatus)) {
    errors.push(
      `No se puede cambiar de ${currentStatus} a ${newStatus}. Transiciones válidas: ${allowedTransitions.join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
