import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('arkaiv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ProgressData {
  userId?: string;
  goal?: string;
  level?: string;
  commitment?: number;
  duration?: number;
  marksheetUploaded?: boolean;
  marksheetName?: string;
}

export const progressService = {
  async saveProgress(data: ProgressData) {
    const response = await api.post('/progress', data);
    return response.data;
  },

  async getProgress() {
    const response = await api.get('/progress');
    return response.data;
  },

  async updateProgress(id: string, data: Partial<ProgressData>) {
    const response = await api.put(`/progress/${id}`, data);
    return response.data;
  },

  async uploadMarksheet(file: File) {
    const formData = new FormData();
    formData.append('marksheet', file);
    const response = await api.post('/progress/upload-marksheet', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async syncGovernmentPlatform(platform: string) {
    const response = await api.post('/progress/sync-platform', { platform });
    return response.data;
  },
};

export default progressService;