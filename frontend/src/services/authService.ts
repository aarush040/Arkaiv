import apiClient from './apiClient';

export const authService = {
  async login(data: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', data);
    if (response.data.accessToken) {
      localStorage.setItem('arkaiv_token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('arkaiv_refresh_token', response.data.refreshToken);
      }
    }
    return response.data;
  },

  async register(data: { name: string; email: string; password: string }) {
    const response = await apiClient.post('/auth/register', data);
    if (response.data.accessToken) {
      localStorage.setItem('arkaiv_token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('arkaiv_refresh_token', response.data.refreshToken);
      }
    }
    return response.data;
  },

  async googleAuth(data: { googleId: string; name: string; email: string; avatar?: string }) {
    const response = await apiClient.post('/auth/google', data);
    if (response.data.accessToken) {
      localStorage.setItem('arkaiv_token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('arkaiv_refresh_token', response.data.refreshToken);
      }
    }
    return response.data;
  },

  async getMe() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('arkaiv_token');
      localStorage.removeItem('arkaiv_refresh_token');
    }
  },
};

export default authService;