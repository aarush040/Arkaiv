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

export interface TaskData {
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  dueDate?: string;
  completed?: boolean;
}

export const taskService = {
  async createTask(data: TaskData) {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  async getTasks() {
    const response = await api.get('/tasks');
    return response.data;
  },

  async updateTask(id: string, data: Partial<TaskData>) {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: string) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;