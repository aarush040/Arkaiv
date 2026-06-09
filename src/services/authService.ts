import apiClient from './apiClient';

/**
 * Authentication service. All authentication flows go through the ARKAIV
 * backend. No localStorage-only authentication is used in the application.
 *
 * JWT access + refresh tokens returned by the backend are stored in
 * localStorage by the apiClient interceptor so subsequent requests can
 * authenticate the user.
 *
 * The required public API of this service is:
 *   - login()              — local email/password login
 *   - register()           — local email/password registration
 *   - logout()             — clear local JWTs and invalidate the refresh token
 *   - getCurrentUser()     — fetch the currently authenticated user
 *   - loginWithGoogle()    — kick off the Google OAuth 2.0 redirect flow
 */
export const authService = {
  /**
   * Local email/password login.
   * POST /api/auth/login
   */
  async login(data: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', data);
    this._persistTokens(response.data);
    return response.data;
  },

  /**
   * Local email/password registration.
   * POST /api/auth/register
   */
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const response = await apiClient.post('/auth/register', data);
    this._persistTokens(response.data);
    return response.data;
  },

  /**
   * Fetch the currently authenticated user from the backend.
   * GET /api/auth/me
   */
  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Log the current user out. Invalidates the refresh token server-side
   * and clears the local JWTs.
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      try {
        localStorage.removeItem('arkaiv_token');
        localStorage.removeItem('arkaiv_refresh_token');
      } catch {
        // ignore — localStorage may be unavailable
      }
    }
  },

  /**
   * Begin the Google OAuth 2.0 sign-in flow. The browser is redirected to
   * the backend's `/api/auth/google` endpoint, which then bounces to Google.
   * On success Google redirects back to `/api/auth/google/callback`, which
   * generates JWTs and finally redirects the browser to:
   *
   *   <FRONTEND_URL>/auth/callback?accessToken=...&refreshToken=...
   *
   * The `App` component is responsible for reading those tokens and
   * hydrating the user session.
   */
  loginWithGoogle(): void {
    // Use the apiClient baseURL so the redirect target respects the same
    // backend the SPA is configured to talk to.
    const baseURL: string =
      (apiClient.defaults && (apiClient.defaults.baseURL as string)) ||
      (import.meta as any).env?.VITE_API_URL ||
      'http://localhost:3000/api';

    // baseURL already ends with /api; strip it to get the backend origin.
    const backendOrigin = baseURL.replace(/\/api\/?$/, '');

    // Full-page redirect so the browser starts the OAuth flow.
    window.location.href = `${backendOrigin}/api/auth/google`;
  },

  /**
   * Helper: persist tokens returned by the backend into localStorage.
   * Centralised here so individual methods don't repeat the logic.
   */
  _persistTokens(data: { accessToken?: string; refreshToken?: string }) {
    try {
      if (data.accessToken) {
        localStorage.setItem('arkaiv_token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('arkaiv_refresh_token', data.refreshToken);
      }
    } catch {
      // localStorage unavailable (SSR / private mode) — ignore.
    }
  },
};

export default authService;
