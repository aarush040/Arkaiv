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

export interface RoadmapData {
  goal: string;
  targetDate?: string;
}

export const roadmapService = {
  async createRoadmap(data: RoadmapData) {
    const response = await api.post('/roadmaps', data);
    return response.data;
  },

  async getRoadmaps() {
    const response = await api.get('/roadmaps');
    return response.data;
  },

  async updateRoadmap(id: string, data: Partial<{ goal: string; targetDate: string; progress: number }>) {
    const response = await api.put(`/roadmaps/${id}`, data);
    return response.data;
  },

  async updateStepStatus(roadmapId: string, stepId: string, completed: boolean) {
    const response = await api.put(`/roadmaps/${roadmapId}/steps/${stepId}`, { completed });
    return response.data;
  },

  async generateRoadmap(goal: string, duration?: string, level?: string) {
    const response = await api.post('/ai/generate-roadmap', { goal, duration, level });
    return response.data;
  },
};

export default roadmapService;