import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('arkaiv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('arkaiv_token');
      localStorage.removeItem('arkaiv_refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async googleAuth(data: { googleId: string; name: string; email: string; avatar?: string }) {
    const response = await api.post('/auth/google', data);
    if (response.data.accessToken) {
      localStorage.setItem('arkaiv_token', response.data.accessToken);
      localStorage.setItem('arkaiv_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post('/auth/register', data);
    if (response.data.accessToken) {
      localStorage.setItem('arkaiv_token', response.data.accessToken);
      localStorage.setItem('arkaiv_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await api.post('/auth/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('arkaiv_token', response.data.accessToken);
      localStorage.setItem('arkaiv_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('arkaiv_token');
      localStorage.removeItem('arkaiv_refresh_token');
      localStorage.removeItem('arkaiv_auth');
    }
  },
};

export default authService;