import apiClient from './apiClient';

export interface ProgressData {
  goal?: string;
  level?: string;
  commitment?: number;
  duration?: number;
  marksheetUploaded?: boolean;
  marksheetName?: string;
}

/**
 * Progress service — manages the user's progress document (goal, level,
 * commitment, duration, marksheet metadata). Backed by MongoDB via the
 * ARKAIV REST API.
 */
export const progressService = {
  /** GET /api/progress */
  async get() {
    const response = await apiClient.get('/progress');
    return response.data;
  },

  /** PUT /api/progress */
  async save(data: ProgressData) {
    const response = await apiClient.put('/progress', data);
    return response.data;
  },

  /** POST /api/progress (alias used by some clients) */
  async create(data: ProgressData) {
    const response = await apiClient.post('/progress', data);
    return response.data;
  },

  /** POST /api/progress/upload-marksheet (multipart/form-data) */
  async uploadMarksheet(file: File) {
    const formData = new FormData();
    formData.append('marksheet', file);
    const response = await apiClient.post('/progress/upload-marksheet', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** POST /api/progress/sync-platform */
  async syncGovernmentPlatform(platform: string) {
    const response = await apiClient.post('/progress/sync-platform', { platform });
    return response.data;
  },
};

export default progressService;
