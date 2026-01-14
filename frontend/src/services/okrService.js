import api from './api';

export const okrService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.quarter) params.append('quarter', filters.quarter);
      if (filters.owner) params.append('owner', filters.owner);
      if (filters.department) params.append('department', filters.department);

      const { data } = await api.get(`/okrs?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching OKRs:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/okrs/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching OKR:', error);
      throw error;
    }
  },

  async create(okrData) {
    try {
      const { data } = await api.post('/okrs', okrData);
      return data;
    } catch (error) {
      console.error('Error creating OKR:', error);
      throw error;
    }
  },

  async update(id, okrData) {
    try {
      const { data } = await api.put(`/okrs/${id}`, okrData);
      return data;
    } catch (error) {
      console.error('Error updating OKR:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/okrs/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting OKR:', error);
      throw error;
    }
  }
};
