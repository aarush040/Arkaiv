import { Router } from 'express';
import {
  googleAuth,
  googleAuthRedirect,
  googleAuthCallback,
  register,
  login,
  getMe,
  logout,
  refreshToken,
} from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

/**
 * GET /api/auth/google
 * Initiates Google OAuth 2.0 redirect flow. Browser is redirected to Google.
 */
router.get('/google', googleAuthRedirect);

/**
 * GET /api/auth/google/callback
 * Google OAuth callback. Issues JWT tokens and redirects to the frontend.
 */
router.get('/google/callback', googleAuthCallback);

/**
 * POST /api/auth/google
 * Programmatic Google sign-in (used by frontend when a Google ID token is already available).
 */
router.post('/google', googleAuth);

/**
 * POST /api/auth/register
 * Local email/password registration. Returns JWT access + refresh tokens.
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Local email/password login. Returns JWT access + refresh tokens.
 */
router.post('/login', login);

/**
 * POST /api/auth/refresh
 * Exchange a valid refresh token for new tokens.
 */
router.post('/refresh', refreshToken);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user.
 */
router.get('/me', authenticateJWT, getMe);

/**
 * POST /api/auth/logout
 * Invalidates the user's refresh token.
 */
router.post('/logout', authenticateJWT, logout);

export default router;
