import api from './api';

export const activityService = {
  async getActivitiesByRequestId(requestId) {
    try {
      const { data } = await api.get(`/requests/${requestId}/activities`);
      return data.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  async createActivity(requestId, activityData) {
    try {
      const { data } = await api.post(`/requests/${requestId}/activities`, activityData);
      return data.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },
};
