import api from './api';

export const roadmapService = {
  /**
   * Get all roadmap items (across all products)
   */
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.quarter) params.append('quarter', filters.quarter);
      if (filters.status) params.append('status', filters.status);
      if (filters.productId) params.append('productId', filters.productId);

      // Get all products with their roadmap items
      const { data } = await api.get(`/products?${params.toString()}`);

      // Extract roadmap items from all products
      const allRoadmapItems = [];
      data.data?.forEach(product => {
        if (product.roadmapItems) {
          product.roadmapItems.forEach(item => {
            allRoadmapItems.push({
              ...item,
              productId: product.id,
              productName: product.name
            });
          });
        }
      });

      return { data: allRoadmapItems };
    } catch (error) {
      console.error('Error fetching roadmap items:', error);
      throw error;
    }
  },

  /**
   * Get roadmap items for a specific product
   */
  async getByProduct(productId) {
    try {
      const { data } = await api.get(`/products/${productId}`);
      return { data: data.data?.roadmapItems || [] };
    } catch (error) {
      console.error('Error fetching product roadmap:', error);
      throw error;
    }
  },

  /**
   * Create new roadmap item
   */
  async create(productId, roadmapData) {
    try {
      const { data } = await api.post(`/products/${productId}/roadmap`, roadmapData);
      return data;
    } catch (error) {
      console.error('Error creating roadmap item:', error);
      throw error;
    }
  },

  /**
   * Update roadmap item
   */
  async update(productId, itemId, roadmapData) {
    try {
      const { data } = await api.put(`/products/${productId}/roadmap/${itemId}`, roadmapData);
      return data;
    } catch (error) {
      console.error('Error updating roadmap item:', error);
      throw error;
    }
  },

  /**
   * Delete roadmap item
   */
  async delete(productId, itemId) {
    try {
      const { data } = await api.delete(`/products/${productId}/roadmap/${itemId}`);
      return data;
    } catch (error) {
      console.error('Error deleting roadmap item:', error);
      throw error;
    }
  }
};
