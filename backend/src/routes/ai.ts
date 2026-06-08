import { Router } from 'express';
import { chat, generateAIRoadmap, generateAIQuiz, review } from '../controllers/aiController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// POST /api/ai/chat - Chat with AI mentor (protected)
router.post('/chat', authenticateJWT, chat);

// POST /api/ai/generate-roadmap - Generate AI roadmap (protected)
router.post('/generate-roadmap', authenticateJWT, generateAIRoadmap);

// POST /api/ai/generate-quiz - Generate AI quiz (protected)
router.post('/generate-quiz', authenticateJWT, generateAIQuiz);

// POST /api/ai/review - Get AI performance review (protected)
router.post('/review', authenticateJWT, review);

export default router;