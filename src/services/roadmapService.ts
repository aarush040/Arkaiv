import apiClient from './apiClient';

export interface RoadmapData {
  goal: string;
  level?: string;
  commitment?: number;
  duration?: number;
}

export interface StepData {
  title: string;
  description?: string;
  duration?: string;
  completed?: boolean;
  order?: number;
}

/**
 * Roadmap service — manages the user's learning roadmap document.
 * Backed by MongoDB via the ARKAIV REST API.
 */
export const roadmapService = {
  /** GET /api/roadmaps */
  async getAll() {
    const response = await apiClient.get('/roadmaps');
    return response.data;
  },

  /** GET /api/roadmaps/:id */
  async getById(id: string) {
    const response = await apiClient.get(`/roadmaps/${id}`);
    return response.data;
  },

  /** POST /api/roadmaps */
  async create(data: RoadmapData) {
    const response = await apiClient.post('/roadmaps', data);
    return response.data;
  },

  /** PUT /api/roadmaps/:id */
  async update(id: string, data: Partial<RoadmapData> & { steps?: StepData[]; progress?: number }) {
    const response = await apiClient.put(`/roadmaps/${id}`, data);
    return response.data;
  },

  /** PUT /api/roadmaps/:id/steps/:stepId */
  async updateStepStatus(roadmapId: string, stepId: string, completed: boolean) {
    const response = await apiClient.put(`/roadmaps/${roadmapId}/steps/${stepId}`, { completed });
    return response.data;
  },

  /** POST /api/ai/generate-roadmap */
  async generateRoadmap(goal: string, duration?: string, level?: string) {
    const response = await apiClient.post('/ai/generate-roadmap', { goal, duration, level });
    return response.data;
  },
};

export default roadmapService;
