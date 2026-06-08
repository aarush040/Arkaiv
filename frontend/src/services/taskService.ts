import apiClient from './apiClient';

export interface TaskData {
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  dueDate?: string;
  completed?: boolean;
  category?: string;
  duration?: string;
}

export const taskService = {
  async getAll() {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  async create(data: TaskData) {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  async update(id: string, data: Partial<TaskData>) {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;