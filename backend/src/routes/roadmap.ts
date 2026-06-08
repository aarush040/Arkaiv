import { Router } from 'express';
import { createRoadmap, getRoadmaps, updateRoadmap, updateStepStatus } from '../controllers/roadmapController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// POST /api/roadmaps - Create a new roadmap (protected)
router.post('/', authenticateJWT, createRoadmap);

// GET /api/roadmaps - Get all roadmaps for user (protected)
router.get('/', authenticateJWT, getRoadmaps);

// PUT /api/roadmaps/:id - Update a roadmap (protected)
router.put('/:id', authenticateJWT, updateRoadmap);

// PUT /api/roadmaps/:id/steps/:stepId - Update step status (protected)
router.put('/:id/steps/:stepId', authenticateJWT, updateStepStatus);

export default router;