import apiClient from './apiClient';

/**
 * AI service. All AI features are routed through the ARKAIV backend
 * (which talks to Gemini). The frontend NEVER calls an AI provider
 * directly.
 */
export const aiService = {
  /**
   * Chat with the ARKAIV AI mentor.
   * POST /api/ai/chat
   */
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

  /**
   * Generate a quiz on a topic.
   * POST /api/ai/generate-quiz
   */
  async generateQuiz(topic: string, difficulty?: string, numQuestions?: number) {
    const response = await apiClient.post('/ai/generate-quiz', { topic, difficulty, numQuestions });
    return response.data;
  },

  /**
   * Generate a personal performance review.
   * POST /api/ai/review
   */
  async getReview() {
    const response = await apiClient.post('/ai/review');
    return response.data;
  },

  /**
   * Generate a structured roadmap from a goal.
   * POST /api/ai/generate-roadmap
   */
  async generateRoadmap(goal: string, duration?: string, level?: string) {
    const response = await apiClient.post('/ai/generate-roadmap', { goal, duration, level });
    return response.data;
  },

  /**
   * Evaluate a task submission (rubric grading + insights).
   * POST /api/ai/evaluate
   */
  async evaluateSubmission(payload: {
    fileName: string;
    selectedMissionId?: string;
    userGoal?: string;
  }) {
    const response = await apiClient.post('/ai/evaluate', payload);
    return response.data;
  },
};

export default aiService;
