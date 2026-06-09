import { Router } from 'express';
import {
  chat,
  generateAIRoadmap,
  generateAIQuiz,
  review,
  evaluateSubmission,
} from '../controllers/aiController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// All AI endpoints are protected.
router.use(authenticateJWT);

/**
 * POST /api/ai/chat — Chat with the ARKAIV AI mentor.
 */
router.post('/chat', chat);

/**
 * POST /api/ai/generate-roadmap — Generate a structured roadmap from a goal.
 */
router.post('/generate-roadmap', generateAIRoadmap);

/**
 * POST /api/ai/generate-quiz — Generate a quiz on a topic.
 */
router.post('/generate-quiz', generateAIQuiz);

/**
 * POST /api/ai/review — Generate a personal performance review.
 */
router.post('/review', review);

/**
 * POST /api/evaluate — Backwards-compatible task-evaluation endpoint used
 * by the legacy EvaluationView component. Performs a deterministic
 * task-similarity check and returns a 5-dimensional NEP-2020 rubric.
 */
router.post('/evaluate', evaluateSubmission);

export default router;
