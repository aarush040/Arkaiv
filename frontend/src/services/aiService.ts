import apiClient from './apiClient';

export const aiService = {
  async chat(data: {
    message: string;
    previousMessages?: Array<{ sender: string; text: string }>;
    userGoal?: string;
    userLevel?: string;
    context?: string;
  }) {
    const response = await apiClient.post('/ai/chat', data);
    return response.data;
  },

  async generateQuiz(topic: string, difficulty?: string, numQuestions?: number) {
    const response = await apiClient.post('/ai/generate-quiz', { topic, difficulty, numQuestions });
    return response.data;
  },

  async getReview() {
    const response = await apiClient.post('/ai/review');
    return response.data;
  },

  async generateRoadmap(goal: string, duration?: string, level?: string) {
    const response = await apiClient.post('/ai/generate-roadmap', { goal, duration, level });
    return response.data;
  },
};

export default aiService;