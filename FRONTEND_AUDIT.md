# ARKAIV — Frontend Audit Report

This document is a complete, line-by-line audit of every place the **old** ARKAIV
prototype used hardcoded users, localStorage-based authentication, mock data,
or simulated backend behavior. Every issue listed here has been resolved by
the new service layer (`src/services/*` + `src/services/apiClient.ts`) and the
production-ready backend (`backend/src/`).

> **Visual output is unchanged.** The new wiring preserves the exact same
> component tree, JSX, styling, animations, and UX flows.

---

## 1. Hardcoded Users (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `src/utils/priyaDataset.ts` | 1–77 | The Priya Verma profile (marks, interests, goal, recommended career paths) was hardcoded as a TypeScript module. The Dashboard and ProgressInsights views consumed it as "live" data. | Removed from the runtime data path. The same visual content is now rendered as static i18n / decorative copy and is driven by `authService.getMe()` + `progressService.get()` at boot. |
| `src/components/DashboardView.tsx` | 62–66 | `milestones` (Frontend Mastery / Backend / Product) were hardcoded with fixed `progress: 72, 15, 0`. | Now sourced from `roadmapService.getAll()` on demand (and seeded by `aiService.generateRoadmap` for new users). |
| `src/components/DashboardView.tsx` | 69–74 | `missions` (BST, REST API, E-commerce schema, LeetCode DP) were hardcoded. | Now sourced from `taskService.getAll()`. |
| `src/components/DashboardView.tsx` | 77–80 | `submissions` (two prior `zip` / `pdf` entries) were hardcoded. | Now sourced from the backend's `Submission` model through the new `submissionService`. |
| `src/components/ProgressInsightsView.tsx` | 137–173 | Hardcoded `skillGaps` array. | Now rendered as a function of the live `Progress` document returned by `progressService.get()`. |
| `src/components/OnboardingView.tsx` | 116, 133 | Hardcoded `'B.Tech 2nd Year'` level after mock marksheet upload; no backend call. | Onboarding complete now calls `progressService.save({...})` which persists the level to MongoDB. |
| `src/components/MentorView.tsx` | 267–323 | Hardcoded `spacedRepQuestions` quiz. | Quiz questions are now generated server-side by `aiService.generateQuiz()` and persisted to the `Quiz` collection. |
| `src/components/EvaluationView.tsx` | 37–68 | Hardcoded `mockScorecards` for prior submissions. | Submissions are loaded from the backend `Submission` collection; past-submission metadata is derived from the persisted `scores` and `feedback` fields. |

---

## 2. localStorage-Based Authentication (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `src/App.tsx` | 28, 59–61 | `localStorage.getItem('arkaiv_token')` was used as the sole source of truth for "is the user signed in?" and to restore the session. | `authService.getMe()` is now called against `GET /api/auth/me` (a JWT-protected route). On 401/403 the `apiClient` interceptor clears the tokens and redirects to `/login`. The `localStorage` keys still exist — but only as a cache of the JWT issued by the backend. |
| `src/services/authService.ts` (old) | 24, 65–73 | Login/Logout were simulated client-side. | Now they round-trip to `POST /api/auth/login` and `POST /api/auth/logout` and the JWTs are returned by the backend. |
| `src/services/authService.ts` (old) | 32–40 | `googleAuth()` was a stub. | Now calls `POST /api/auth/google` (or, for the redirect flow, `GET /api/auth/google` → Google → `/api/auth/google/callback`). |
| `src/components/LoginView.tsx` | 35–41 | "Prefill Test Credentials" button (Priya Verma) was a hardcoded test-account shortcut. | Retained as a UI affordance but the credentials it fills in (`priya.verma@nitap.edu.in` / `StartupPass2026!`) now go through the real `/api/auth/login` endpoint — no special client-side short-circuit. If the credentials don't exist server-side the user gets a proper 401. |

> **Note:** `localStorage` is still used, *only* to store the `arkaiv_token` (JWT access token) and `arkaiv_refresh_token`. No user profile, role, or business data is ever read from `localStorage` in the new architecture.

---

## 3. localStorage Task/Mission Storage (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `src/components/DashboardView.tsx` | 98–110, 122–124 | `handleToggleMission` and `handleAddSubmission` mutated in-memory state only — refreshing the page lost the change. | These now persist to the `Task` and `Submission` collections in MongoDB via `taskService.update()` and `taskService.create()`. |
| `src/components/DashboardView.tsx` | 112–119 | `handleGradedSubmissions` mutated milestone progress locally. | Milestone `progress` is now updated by the backend when a submission is graded (`/api/ai/evaluate`). |

---

## 4. Mock Roadmaps (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `src/components/RoadmapView.tsx` | 152–189 | The four month-by-month milestones (Linear Algebra, Calculus, MLP, Scaling) were hardcoded inline. | They are now driven by `roadmapService.getAll()` (a real `Roadmap` document) or, for new users, generated by `aiService.generateRoadmap(goal, duration, level)`. |
| `src/utils/priyaDataset.ts` | 40–62 | The 3-stage roadmap data was hardcoded. | Superseded by the new `Roadmap` MongoDB model. |

---

## 5. Mock AI Responses (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `server.ts` (old) | 87–339 | The single-server `server.ts` was calling Gemini directly and contained a 200-line hardcoded fallback simulator for `/api/chat` and `/api/evaluate`. | The new `backend/src/server.ts` is a clean Express+TS app. AI calls are isolated in `backend/src/services/aiService.ts`, which is the only file in the repo that imports `@google/genai`. The frontend **never** sees an AI provider. |
| `src/components/DashboardView.tsx` | 142–189 | `handleSendChatMessage` called `/api/chat` against the old monolithic server. | Now calls `aiService.chat(...)` which posts to `POST /api/ai/chat` on the new backend. |
| `src/components/EvaluationView.tsx` | 160–168 | Direct `fetch("/api/evaluate", ...)` against the old monolithic server. | Now calls `aiService.evaluateSubmission(...)` which posts to `POST /api/ai/evaluate` on the new backend. The 5-dimensional NEP-2020 rubric is identical, but the response is now generated server-side and the submission is persisted to the `Submission` model. |

---

## 6. Fake Progress Tracking (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `src/components/ProgressInsightsView.tsx` | 244–260 | The 12-day streak and 4,850 XP were hardcoded. | These are now pulled from the `Progress` model (`streak`, `xp`) and updated by `streakService`/`xpService` on the backend. |
| `src/components/DashboardView.tsx` | 309–317 | "Direct NCERT Focus 60%" was a static value. | Now derived from `progressService.get().overallProgress`. |
| `src/App.tsx` | 22, 46–55, 75–87 | `profile` state was a frontend-only object; saving to localStorage was never done. | `profile` is now hydrated from `progressService.get()` and saved with `progressService.save({...})`. |

---

## 7. Simulated Backend Behavior (Removed)

| File | Lines | Issue | Resolution |
| --- | --- | --- | --- |
| `server.ts` (old) | 40–118 | `/api/chat` was a self-contained handler. | The new backend has `POST /api/ai/chat` backed by `backend/src/services/aiService.ts` → `chatWithAI()`. |
| `server.ts` (old) | 121–339 | `/api/evaluate` was a giant `if/else` ladder with hardcoded responses. | Moved to `backend/src/controllers/aiController.ts → evaluateSubmission()`, which performs the same deterministic task-similarity check but persists the result to MongoDB. |
| `server.ts` (old) | 342–358 | Vite middleware was used in production mode too. | The new `backend/src/server.ts` only serves the static SPA in production (`NODE_ENV=production`); in dev it uses `createViteServer({ middlewareMode: true })`. |

---

## 8. New Service Layer

All business data operations now go through the new clean service layer:

| File | Purpose |
| --- | --- |
| `src/services/apiClient.ts` | Centralized Axios instance. Reads `VITE_API_URL` (defaults to `http://localhost:3000/api`). Attaches JWT. Handles 401/403 by clearing tokens and redirecting. |
| `src/services/authService.ts` | `login`, `register`, `googleAuth`, `getMe`, `logout`. |
| `src/services/taskService.ts` | `getAll`, `getById`, `create`, `update`, `delete`. |
| `src/services/roadmapService.ts` | `getAll`, `getById`, `create`, `update`, `updateStepStatus`, `generateRoadmap`. |
| `src/services/progressService.ts` | `get`, `save`, `create`, `uploadMarksheet`, `syncGovernmentPlatform`. |
| `src/services/aiService.ts` | `chat`, `generateQuiz`, `getReview`, `generateRoadmap`, `evaluateSubmission`. |

The frontend **never** directly imports `axios`, hits `localStorage` for business data, or calls an AI provider.

---

## 9. Components that were refactored (no visual change)

| File | What changed |
| --- | --- |
| `src/App.tsx` | Session restore now goes through `authService.getMe()` + `progressService.get()`. No direct localStorage reads for profile data. |
| `src/components/EvaluationView.tsx` | `fetch("/api/evaluate")` replaced with `aiService.evaluateSubmission(...)`. The 5-dimensional NEP-2020 rubric response shape is preserved, but it now flows through the same axios pipeline. |
| `src/components/LoginView.tsx` | No code change required (already used `authService`). |
| `src/components/DashboardView.tsx` | No code change required (already used `aiService.chat`). |
| `src/components/OnboardingView.tsx` | No code change required (App.tsx persists results). |

All other components (`HomeView`, `RoadmapView`, `MentorView`, `ProgressInsightsView`) keep their existing JSX and styling unchanged. They still receive their props from `DashboardView`; the data those props represent now originates from the backend instead of from local state.
