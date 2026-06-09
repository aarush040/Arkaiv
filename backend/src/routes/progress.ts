import { Router } from 'express';
import {
  getProgress,
  saveProgress,
  uploadMarksheet,
  syncGovernmentPlatform,
} from '../controllers/progressController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// All progress endpoints are protected.
router.use(authenticateJWT);

/**
 * GET /api/progress — get the current user's progress document.
 */
router.get('/', getProgress);

/**
 * PUT /api/progress — create or update the current user's progress document.
 */
router.put('/', saveProgress);

/**
 * POST /api/progress — alternative upsert used by some clients.
 */
router.post('/', saveProgress);

/**
 * POST /api/progress/upload-marksheet — record an uploaded marksheet.
 */
router.post('/upload-marksheet', uploadMarksheet);

/**
 * POST /api/progress/sync-platform — record a sync with a government platform.
 */
router.post('/sync-platform', syncGovernmentPlatform);

export default router;
