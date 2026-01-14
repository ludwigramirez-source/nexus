import api from './api';

export const productService = {
  async getAll() {
    try {
      const { data } = await api.get('/products');
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async create(productData) {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
