import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies httpOnly
});

// Request interceptor - añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - manejar errores y refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos intentado refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refresh token
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Guardar nuevo token
        localStorage.setItem('access_token', data.data.accessToken);

        // Asegurarse de que el header existe
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }

        // Actualizar el header de autorización
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

        // Reintentar request original
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló - logout
        localStorage.removeItem('access_token');
        window.location.href = '/authentication-and-access-control';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
