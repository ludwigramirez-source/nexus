import api from './api';

export const clientService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.tier) params.append('tier', filters.tier);
      if (filters.healthScore) params.append('healthScore', filters.healthScore);
      if (filters.productId) params.append('productId', filters.productId);

      const { data } = await api.get(`/clients?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/clients/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  async create(clientData) {
    try {
      const { data } = await api.post('/clients', clientData);
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async update(id, clientData) {
    try {
      const { data } = await api.put(`/clients/${id}`, clientData);
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/clients/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};
