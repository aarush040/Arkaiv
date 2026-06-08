import apiClient from './apiClient';

export interface ProgressData {
  goal?: string;
  level?: string;
  commitment?: number;
  duration?: number;
  marksheetUploaded?: boolean;
  marksheetName?: string;
}

export const progressService = {
  async get() {
    const response = await apiClient.get('/progress');
    return response.data;
  },

  async save(data: ProgressData) {
    const response = await apiClient.put('/progress', data);
    return response.data;
  },

  async uploadMarksheet(file: File) {
    const formData = new FormData();
    formData.append('marksheet', file);
    const response = await apiClient.post('/progress/upload-marksheet', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getQuizResults() {
    const response = await apiClient.get('/progress/quiz-results');
    return response.data;
  },

  async getStreak() {
    const response = await apiClient.get('/progress/streak');
    return response.data;
  },
};

export default progressService;