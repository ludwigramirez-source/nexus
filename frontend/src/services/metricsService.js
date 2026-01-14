import api from './api';

export const metricsService = {
  async getDashboardMetrics(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      if (filters.team) params.append('team', filters.team);

      const { data } = await api.get(`/metrics/overview?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  async getCapacityMetrics(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const { data } = await api.get(`/metrics/capacity?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching capacity metrics:', error);
      throw error;
    }
  },

  async getProductCustomRatio(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);

      const { data } = await api.get(`/metrics/product-vs-custom?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching product/custom ratio:', error);
      throw error;
    }
  },

  async getTeamPerformance(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);

      const { data } = await api.get(`/metrics/team-velocity?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Error fetching team performance:', error);
      throw error;
    }
  },

  async getFinancialMetrics(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.period) params.append('period', filters.period);

      // This endpoint doesn't exist in backend yet, return empty data
      return { data: { revenue: 0, costs: 0, profit: 0 } };
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      throw error;
    }
  },

  async getAIInsights() {
    try {
      const { data } = await api.post('/metrics/generate-insights', {});
      return data;
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  },

  async getWeeklyMetrics() {
    try {
      const { data } = await api.get('/metrics/weekly');
      return data;
    } catch (error) {
      console.error('Error fetching weekly metrics:', error);
      throw error;
    }
  },

  async getRequestsFunnel() {
    try {
      const { data } = await api.get('/metrics/requests-funnel');
      return data;
    } catch (error) {
      console.error('Error fetching requests funnel:', error);
      throw error;
    }
  }
};
