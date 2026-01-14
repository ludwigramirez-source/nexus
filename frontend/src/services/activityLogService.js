import axios from 'axios';

const API_URL = 'http://localhost:3001/api/activity-logs';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const activityLogService = {
  // Get recent activity logs
  getRecent: async () => {
    try {
      const response = await axiosInstance.get('/recent');
      return {
        success: true,
        data: response.data?.data || []
      };
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get all activity logs with filters
  getAll: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/', { params: filters });
      return {
        success: true,
        data: response.data?.data || []
      };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get activity logs by user
  getByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}`);
      return {
        success: true,
        data: response.data?.data || []
      };
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default activityLogService;
