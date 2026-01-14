import api from './api';

export const userService = {
  async getAll() {
    try {
      const { data } = await api.get('/users');
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async create(userData) {
    try {
      const { data } = await api.post('/users', userData);
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async update(id, userData) {
    try {
      const { data } = await api.put(`/users/${id}`, userData);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async updatePassword(id, password) {
    try {
      const { data } = await api.patch(`/users/${id}/password`, { password });
      return data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const { data } = await api.patch(`/users/${id}/status`, { status });
      return data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};
