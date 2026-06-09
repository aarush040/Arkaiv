import apiClient from './apiClient';

export interface TaskData {
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: string;
  dueDate?: string;
  completed?: boolean;
}

/**
 * Task service — CRUD for the user's daily study tasks.
 * Backed by MongoDB via the ARKAIV REST API.
 */
export const taskService = {
  /** GET /api/tasks */
  async getAll() {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  /** GET /api/tasks/:id */
  async getById(id: string) {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  /** POST /api/tasks */
  async create(data: TaskData) {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  /** PUT /api/tasks/:id */
  async update(id: string, data: Partial<TaskData>) {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  /** DELETE /api/tasks/:id */
  async delete(id: string) {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
