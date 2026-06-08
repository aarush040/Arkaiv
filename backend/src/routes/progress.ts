import { Router } from 'express';
import { getProgress, updateProgress } from '../controllers/progressController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// GET /api/progress - Get user progress (protected)
router.get('/', authenticateJWT, getProgress);

// PUT /api/progress - Update user progress (protected)
router.put('/', authenticateJWT, updateProgress);

export default router;