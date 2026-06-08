import { Router } from 'express';
import { googleAuth, localRegister, localLogin, getMe, logout } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// POST /api/auth/google - Google OAuth login
router.post('/google', googleAuth);

// POST /api/auth/register - Local registration
router.post('/register', localRegister);

// POST /api/auth/login - Local login
router.post('/login', localLogin);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticateJWT, getMe);

// POST /api/auth/logout - Logout
router.post('/logout', authenticateJWT, logout);

export default router;