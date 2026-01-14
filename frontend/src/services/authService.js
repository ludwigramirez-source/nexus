import api from './api';

export const authService = {
  async register(userData) {
    const { data } = await api.post('/auth/register', userData);

    // Guardar token
    localStorage.setItem('access_token', data.data.tokens.accessToken);

    return data.data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });

    // Guardar token
    localStorage.setItem('access_token', data.data.tokens.accessToken);

    return data.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
    }
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async refreshToken() {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('access_token', data.data.accessToken);
    return data.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
