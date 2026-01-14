import api from './api';

export const dashboardService = {
  /**
   * Get dashboard metrics
   */
  async getMetrics() {
    try {
      const response = await api.get('/dashboard/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  /**
   * Get all products with their clients
   */
  async getProductsWithClients() {
    try {
      const response = await api.get('/dashboard/products-with-clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching products with clients:', error);
      throw error;
    }
  },

  /**
   * Get clients for a specific product
   */
  async getClientsByProduct(productId) {
    try {
      const response = await api.get(`/dashboard/products/${productId}/clients`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching clients for product ${productId}:`, error);
      throw error;
    }
  },
};

export default dashboardService;
