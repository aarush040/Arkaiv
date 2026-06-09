import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens';
import { AuthRequest } from '../middleware/auth';
import { isMongoConnected } from '../config/db';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Database is not connected. Please try again later.' });
      return;
    }

    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: 'An account with this email is already registered' });
      return;
    }

    const user = await User.create({ name, email, password, phone });

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// Backwards-compatible alias
export const localRegister = register;

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Database is not connected. Please try again later.' });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// Backwards-compatible alias
export const localLogin = login;

export async function getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Database is not connected. Please try again later.' });
      return;
    }

    if (!req.user?.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user.toJSON());
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user?.userId) {
      await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      res.status(403).json({ error: 'Invalid refresh token' });
      return;
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!isMongoConnected()) {
      res.status(503).json({ error: 'Database is not connected. Please try again later.' });
      return;
    }

    const { googleId, name, email, avatar } = req.body;

    if (!googleId || !email) {
      res.status(400).json({ error: 'Google ID and email are required' });
      return;
    }

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        await user.save();
      } else {
        user = await User.create({
          googleId,
          name: name || 'Google User',
          email,
          avatar,
        });
      }
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshTokenValue = generateRefreshToken(payload);

    user.refreshToken = refreshTokenValue;
    await user.save();

    res.json({
      user: user.toJSON(),
      accessToken,
      refreshToken: refreshTokenValue,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Initiate Google OAuth 2.0 redirect flow.
 * GET /api/auth/google
 */
export function googleAuthRedirect(req: Request, res: Response, next: NextFunction): void {
  // If passport/google strategy is not configured, respond with helpful error
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    res.status(501).json({
      error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the backend .env file.',
    });
    return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

/**
 * Google OAuth callback handler.
 * GET /api/auth/google/callback
 */
export function googleAuthCallback(req: Request, res: Response, next: NextFunction): void {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  passport.authenticate('google', { session: false, failureRedirect: `${frontendUrl}/login` }, async (err: any, user: any) => {
    if (err) {
      console.error('[Auth] Google OAuth callback error:', err.message);
      // Redirect to frontend with a descriptive error rather than crashing
      return res.redirect(`${frontendUrl}/login?error=google_auth_failed&reason=${encodeURIComponent(err.message || 'Server error')}`);
    }
    if (!user) {
      return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }

    try {
      const payload = { userId: user._id.toString(), email: user.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      user.refreshToken = refreshToken;
      await user.save();

      // Redirect to frontend with tokens
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (saveErr: any) {
      console.error('[Auth] Failed to issue tokens after Google auth:', saveErr.message);
      return res.redirect(`${frontendUrl}/login?error=google_auth_failed&reason=${encodeURIComponent(saveErr.message || 'Token generation failed')}`);
    }
  })(req, res, next);
}
