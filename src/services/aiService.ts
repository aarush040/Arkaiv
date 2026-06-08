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

export const aiService = {
  async chat(data: {
    message: string;
    previousMessages?: Array<{ sender: string; text: string }>;
    userGoal?: string;
    userLevel?: string;
    context?: string;
  }) {
    const response = await api.post('/ai/chat', data);
    return response.data;
  },

  async generateQuiz(topic: string, difficulty?: string, numQuestions?: number) {
    const response = await api.post('/ai/generate-quiz', { topic, difficulty, numQuestions });
    return response.data;
  },

  async getReview() {
    const response = await api.post('/ai/review');
    return response.data;
  },

  async generateRoadmap(goal: string, duration?: string, level?: string) {
    const response = await api.post('/ai/generate-roadmap', { goal, duration, level });
    return response.data;
  },
};

export default aiService;