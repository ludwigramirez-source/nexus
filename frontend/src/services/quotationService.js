import api from './api';

/**
 * Quotation Service
 * Handles all API calls related to quotations
 */
export const quotationService = {
  /**
   * Get all quotations with optional filters
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED_TO_ORDER, or 'all')
   * @param {string} filters.clientId - Filter by client ID
   * @param {string} filters.dateFrom - Filter by date from (ISO string)
   * @param {string} filters.dateTo - Filter by date to (ISO string)
   * @param {string} filters.search - Search by quotation number or client name
   * @returns {Promise<Array>} Array of quotations
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.clientId) {
        params.append('clientId', filters.clientId);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await api.get(`/quotations?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quotations:', error);
      throw error;
    }
  },

  /**
   * Get quotation by ID
   * @param {string} id - Quotation ID
   * @returns {Promise<Object>} Quotation details
   */
  async getById(id) {
    try {
      const response = await api.get(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quotation:', error);
      throw error;
    }
  },

  /**
   * Create a new quotation
   * @param {Object} data - Quotation data
   * @param {string} data.clientId - Client ID
   * @param {string} data.validUntil - Valid until date (ISO string)
   * @param {string} data.currency - Currency (USD, COP, etc.)
   * @param {string} data.deliveryTime - Delivery time
   * @param {string} data.paymentTerms - Payment terms
   * @param {string} data.warranty - Warranty information
   * @param {string} data.observations - Observations
   * @param {string} data.internalNotes - Internal notes
   * @param {Array} data.items - Array of quotation items
   * @returns {Promise<Object>} Created quotation
   */
  async create(data) {
    try {
      const response = await api.post('/quotations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating quotation:', error);
      throw error;
    }
  },

  /**
   * Update quotation
   * @param {string} id - Quotation ID
   * @param {Object} data - Updated quotation data
   * @returns {Promise<Object>} Updated quotation
   */
  async update(id, data) {
    try {
      const response = await api.put(`/quotations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating quotation:', error);
      throw error;
    }
  },

  /**
   * Update quotation status
   * @param {string} id - Quotation ID
   * @param {string} status - New status
   * @param {string} rejectionReason - Rejection reason (optional, required if status is REJECTED)
   * @returns {Promise<Object>} Updated quotation
   */
  async updateStatus(id, status, rejectionReason = null) {
    try {
      const data = { status };
      if (rejectionReason) {
        data.rejectionReason = rejectionReason;
      }
      const response = await api.patch(`/quotations/${id}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating quotation status:', error);
      throw error;
    }
  },

  /**
   * Delete quotation
   * @param {string} id - Quotation ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      const response = await api.delete(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quotation:', error);
      throw error;
    }
  },

  /**
   * Duplicate quotation
   * @param {string} id - Quotation ID to duplicate
   * @returns {Promise<Object>} New quotation
   */
  async duplicate(id) {
    try {
      const response = await api.post(`/quotations/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating quotation:', error);
      throw error;
    }
  },

  /**
   * Generate PDF for quotation
   * @param {string} id - Quotation ID
   * @returns {Promise<Blob>} PDF blob
   */
  async generatePDF(id) {
    try {
      const response = await api.get(`/quotations/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  },

  /**
   * Send quotation via email
   * @param {string} id - Quotation ID
   * @param {Object} emailData - Email data
   * @param {string} emailData.to - Recipient email
   * @param {string} emailData.cc - CC emails (comma separated)
   * @param {string} emailData.bcc - BCC emails (comma separated)
   * @param {string} emailData.subject - Email subject
   * @param {string} emailData.body - Email body
   * @returns {Promise<Object>} Result
   */
  async sendEmail(id, emailData) {
    try {
      const response = await api.post(`/quotations/${id}/send-email`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  /**
   * Get kanban data (quotations grouped by status for sales funnel)
   * @param {Object} filters - Filter options
   * @param {string} filters.clientId - Filter by client ID
   * @param {string} filters.dateFrom - Filter by date from (ISO string)
   * @param {string} filters.dateTo - Filter by date to (ISO string)
   * @param {number} filters.minAmount - Filter by minimum amount
   * @param {number} filters.maxAmount - Filter by maximum amount
   * @param {string} filters.currency - Filter by currency
   * @param {string} filters.search - Search by quotation number or client name
   * @returns {Promise<Object>} Kanban data with columns
   */
  async getKanbanData(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.clientId) {
        params.append('clientId', filters.clientId);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.minAmount) {
        params.append('minAmount', filters.minAmount);
      }
      if (filters.maxAmount) {
        params.append('maxAmount', filters.maxAmount);
      }
      if (filters.currency) {
        params.append('currency', filters.currency);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await api.get(`/quotations/kanban?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kanban data:', error);
      throw error;
    }
  }
};
