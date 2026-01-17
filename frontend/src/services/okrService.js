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
  },

  async updateStatus(id, status) {
    try {
      const { data } = await api.patch(`/okrs/${id}/status`, { status });
      return data;
    } catch (error) {
      console.error('Error updating OKR status:', error);
      throw error;
    }
  },

  // ========== KEY RESULTS ==========

  async createKeyResult(okrId, keyResultData) {
    try {
      const { data } = await api.post(`/okrs/${okrId}/key-results`, keyResultData);
      return data;
    } catch (error) {
      console.error('Error creating key result:', error);
      throw error;
    }
  },

  async updateKeyResult(okrId, krId, keyResultData) {
    try {
      const { data } = await api.put(`/okrs/${okrId}/key-results/${krId}`, keyResultData);
      return data;
    } catch (error) {
      console.error('Error updating key result:', error);
      throw error;
    }
  },

  async deleteKeyResult(okrId, krId) {
    try {
      const { data } = await api.delete(`/okrs/${okrId}/key-results/${krId}`);
      return data;
    } catch (error) {
      console.error('Error deleting key result:', error);
      throw error;
    }
  },

  async updateKeyResultProgress(okrId, krId, currentValue) {
    try {
      const { data } = await api.patch(`/okrs/${okrId}/key-results/${krId}/progress`, { currentValue });
      return data;
    } catch (error) {
      console.error('Error updating key result progress:', error);
      throw error;
    }
  }
};
