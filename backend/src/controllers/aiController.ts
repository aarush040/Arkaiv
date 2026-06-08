import { Request, Response } from 'express';
import { chatWithAI, generateRoadmap, generateQuiz, generatePerformanceReview } from '../services/aiService';
import Task from '../models/Task';

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, previousMessages, userGoal, userLevel, context } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const response = await chatWithAI(
      message,
      previousMessages || [],
      userGoal || 'General Learning',
      userLevel || 'Intermediate',
      context || 'General Study'
    );

    res.json({ text: response, mode: 'ai' });
  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI chat failed' });
  }
};

export const generateAIRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { goal, duration, level } = req.body;

    if (!goal) {
      res.status(400).json({ error: 'Goal is required' });
      return;
    }

    const steps = await generateRoadmap(goal, duration || '30', level || 'beginner');

    res.json({ steps });
  } catch (error: any) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
};

export const generateAIQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    if (!topic) {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    const questions = await generateQuiz(topic, difficulty || 'medium', numQuestions || 5);

    res.json({ questions });
  } catch (error: any) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};

export const review = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Gather user stats for review
    const tasks = await Task.find({ userId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;

    const reviewText = await generatePerformanceReview(userId, {
      tasksCompleted: completedTasks,
      tasksTotal: totalTasks,
      quizzesPassed: 0,
      studyHours: 0,
      streak: 0,
    });

    res.json({ review: reviewText });
  } catch (error: any) {
    console.error('Generate review error:', error);
    res.status(500).json({ error: 'Failed to generate review' });
  }
};