import axios from 'axios';

/**
 * Centralized API client for the ARKAIV frontend.
 *
 * The frontend NEVER talks to MongoDB, AI providers, or any other backend
 * service directly. All data operations are performed through this client,
 * which proxies to the ARKAIV REST API at `API_BASE_URL`.
 */

// Centralized, configurable API base URL.
// - In dev: defaults to http://localhost:3000/api
// - In production: set VITE_API_URL in your build environment
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Attach JWT access token (if any) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('arkaiv_token');
    if (token) {
      config.headers = config.headers || ({} as any);
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch {
    // localStorage unavailable (SSR or private mode) — continue without token
  }
  return config;
});

// Handle 401/403 responses — clear the session and redirect to login.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      try {
        localStorage.removeItem('arkaiv_token');
        localStorage.removeItem('arkaiv_refresh_token');
      } catch {
        // ignore
      }
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
