import api from './api';

export const assignmentService = {
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.requestId) params.append('requestId', filters.requestId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const { data } = await api.get(`/assignments?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/assignments/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      const { data } = await api.post('/assignments', assignmentData);
      return data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  async update(id, assignmentData) {
    try {
      const { data } = await api.put(`/assignments/${id}`, assignmentData);
      return data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/assignments/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  }
};
