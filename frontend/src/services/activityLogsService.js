import api from './api';

export const activityLogsService = {
  /**
   * Get all activity logs with filters
   */
  async getAll(filters = {}) {
    try {
      const { data } = await api.get('/activity-logs', { params: filters });
      return data.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  },

  /**
   * Get recent activity logs (for dashboard widget)
   */
  async getRecent(limit = 5) {
    try {
      const { data } = await api.get('/activity-logs/recent', { params: { limit } });
      return data.data.logs;
    } catch (error) {
      console.error('Error fetching recent activity logs:', error);
      throw error;
    }
  },

  /**
   * Get activity logs by user
   */
  async getByUser(userId, limit = 20) {
    try {
      const { data } = await api.get(`/activity-logs/user/${userId}`, { params: { limit } });
      return data.data.logs;
    } catch (error) {
      console.error('Error fetching user activity logs:', error);
      throw error;
    }
  },

  /**
   * Get activity log statistics
   */
  async getStatistics() {
    try {
      const { data } = await api.get('/activity-logs/statistics');
      return data.data;
    } catch (error) {
      console.error('Error fetching activity log statistics:', error);
      throw error;
    }
  },

  /**
   * Export activity logs to CSV
   */
  async exportToCsv(filters = {}) {
    try {
      const response = await api.get('/activity-logs/export', {
        params: filters,
        responseType: 'blob',
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity-logs-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting activity logs:', error);
      throw error;
    }
  },

  /**
   * Delete old logs
   */
  async deleteOldLogs(daysToKeep = 90) {
    try {
      const { data } = await api.delete('/activity-logs/cleanup', {
        data: { daysToKeep },
      });
      return data.data;
    } catch (error) {
      console.error('Error deleting old logs:', error);
      throw error;
    }
  },
};
