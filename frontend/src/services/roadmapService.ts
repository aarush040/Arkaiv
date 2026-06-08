import apiClient from './apiClient';

export interface RoadmapData {
  goal: string;
  targetDate?: string;
  level?: string;
  duration?: number;
  commitment?: number;
}

export interface StepData {
  title: string;
  description?: string;
  completed?: boolean;
}

export const roadmapService = {
  async getAll() {
    const response = await apiClient.get('/roadmaps');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/roadmaps/${id}`);
    return response.data;
  },

  async create(data: RoadmapData) {
    const response = await apiClient.post('/roadmaps', data);
    return response.data;
  },

  async update(id: string, data: Partial<RoadmapData>) {
    const response = await apiClient.put(`/roadmaps/${id}`, data);
    return response.data;
  },

  async updateStepStatus(roadmapId: string, stepId: string, completed: boolean) {
    const response = await apiClient.put(`/roadmaps/${roadmapId}/steps/${stepId}`, { completed });
    return response.data;
  },
};

export default roadmapService;