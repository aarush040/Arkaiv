# ARKAIV — Migration Notes

This document explains exactly what changed when the ARKAIV frontend
prototype was wired up to the new production-ready backend. The visual UI
is identical — only the data flow changed.

---

## TL;DR

| Concern | Before | After |
| --- | --- | --- |
| Single server file that mixed Vite + Express + Gemini | `server.ts` (root) | Removed. Backend lives in `backend/src/server.ts`. |
| `localStorage` for user / progress / mission data | `src/App.tsx`, `src/components/DashboardView.tsx` | Replaced by REST calls through `src/services/*`. `localStorage` now only caches the JWT. |
| Hardcoded user "Priya Verma" baked into the UI | `src/utils/priyaDataset.ts` + many `useState` literals | All runtime data is loaded from MongoDB via the backend. |
| Direct calls to `@google/genai` | `server.ts` (old) | The frontend never sees an AI provider. Calls go through `aiService.*` → backend → Gemini. |
| `fetch("/api/evaluate")` against the prototype server | `src/components/EvaluationView.tsx` | Now `aiService.evaluateSubmission(...)` → `POST /api/ai/evaluate`. |
| Vite dev server in dev, served `dist/` in prod | `server.ts` (old) | Same pattern, but moved into `backend/src/server.ts`. |
| Single hardcoded API base URL `http://localhost:3000/api` | Inline in every service file | Centralized in `src/services/apiClient.ts`, reading `VITE_API_URL` env var. |
| Hardcoded milestone progress (`72, 15, 0`) | `DashboardView` `useState` | Sourced from the new `Roadmap` model. |

---

## Step-by-step migration

### Step 1 — Audit the prototype

See `FRONTEND_AUDIT.md`. Every line of mock data, hardcoded user, and
`localStorage` read of business data is catalogued there.

### Step 2 — Stand up the new backend

`backend/src/` was already scaffolded (see `package.json` in the repo root
for the dependencies: `express`, `mongoose`, `jsonwebtoken`, `passport`,
`passport-google-oauth20`, `@google/genai`, etc.).

The migrations applied in this PR:

1. **`authController.ts`** — exports renamed to `register` / `login` / `logout`
   / `getMe` / `refreshToken` / `googleAuth` plus new `googleAuthRedirect` and
   `googleAuthCallback` for the OAuth redirect flow.
2. **`middleware/auth.ts`** — added an `authenticateJWT` alias for `authenticate`
   so route files that import either name compile.
3. **`controllers/progressController.ts`** — added `saveProgress`, `uploadMarksheet`,
   and `syncGovernmentPlatform`. `updateProgress` is kept as an alias.
4. **`controllers/aiController.ts`** — created from scratch. Wires
   `chat` / `generateAIRoadmap` / `generateAIQuiz` / `review` to
   `backend/src/services/aiService.ts`, plus a backwards-compatible
   `evaluateSubmission` that matches the old root `/api/evaluate` response
   shape used by `EvaluationView`.
5. **`routes/auth.ts`** — added `/api/auth/google` (GET), `/api/auth/google/callback`,
   and `/api/auth/refresh`.
6. **`routes/progress.ts`** — added `POST /api/progress`,
   `POST /api/progress/upload-marksheet`, `POST /api/progress/sync-platform`.
7. **`routes/ai.ts`** — added `POST /api/ai/evaluate`.
8. **New models** — `Submission`, `Quiz`, `StudyTopic`, `Streak` created under
   `backend/src/models/`.

### Step 3 — Create the central apiClient

`src/services/apiClient.ts` (new) is the **only** Axios instance in the
frontend. It:

- Reads `VITE_API_URL` from the environment (default `http://localhost:3000/api`).
- Attaches `Authorization: Bearer <accessToken>` to every outgoing request.
- On 401 or 403, clears the JWTs from `localStorage` and redirects to `/login`.

### Step 4 — Replace each service with a thin REST wrapper

| File | Change |
| --- | --- |
| `src/services/authService.ts` | Removed inline `axios.create`. Now imports `apiClient` and calls `/auth/*`. |
| `src/services/taskService.ts` | Same. |
| `src/services/roadmapService.ts` | Same. |
| `src/services/progressService.ts` | Same. |
| `src/services/aiService.ts` | Same. Added `evaluateSubmission(payload)` for `EvaluationView`. |

No service file imports `axios` anymore. No service file hardcodes the
backend URL anymore.

### Step 5 — Wire components through the services

`src/components/EvaluationView.tsx`:

- Removed the direct `fetch("/api/evaluate", ...)` call.
- Imports `aiService` and calls `aiService.evaluateSubmission({ fileName, userGoal, selectedMissionId })`.

`src/App.tsx`:

- Still reads `localStorage.getItem('arkaiv_token')` to know whether to call
  `authService.getMe()` on boot. This is the **only** legitimate `localStorage`
  read remaining in the app, and it is exclusively used as a cache for the
  JWT issued by the backend. The data fetched for the user is then loaded
  from `progressService.get()` and `authService.getMe()`.
- All other business state (`profile`, `authUser`) is hydrated from API
  responses.

### Step 6 — Document the new architecture

This folder now ships:

- `ARCHITECTURE_REPORT.md` — the top-level architecture map.
- `FRONTEND_AUDIT.md` — line-by-line audit of every mock removed.
- `API_DOCUMENTATION.md` — every endpoint with request/response shapes.
- `MONGO_SCHEMAS.md` — every Mongoose model.
- `MIGRATION_NOTES.md` — this file.

---

## How to run the new stack

### 1. Backend

```bash
# 1. Copy the env template and fill in your real values
cp .env.example .env
#   - MONGODB_URI
#   - JWT_SECRET / JWT_REFRESH_SECRET
#   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (optional, for OAuth)
#   - GEMINI_API_KEY (optional; without it the AI falls back to a deterministic simulator)

# 2. Start the dev server
npm run dev:backend
# (or, equivalently: npx tsx watch backend/src/server.ts)
```

The server starts on `http://localhost:3000` and prints:

```
[Startup] 🚀 ARKAIV Platform server running on port 3000
[Startup]    Health: http://localhost:3000/api/health
[Startup]    MongoDB: Configured
[Startup]    Gemini AI: Configured
```

### 2. Frontend

```bash
# Either run the dev server standalone (Vite only, hitting the backend on :3000)
npm run dev:frontend
# or run the full stack (backend + Vite middleware)
npm run dev
```

`VITE_API_URL` defaults to `http://localhost:3000/api`. Override it via your
own `.env` for production builds.

### 3. End-to-end smoke test

1. Open `http://localhost:5173`.
2. Click **Sign Up / Register**, fill in name / email / password.
3. Backend issues JWTs; the frontend stores them and routes to onboarding.
4. Fill in goal / level / commitment / duration.
5. `progressService.save(...)` persists to MongoDB.
6. Navigate to **Roadmap** — the data is now live from `roadmapService.getAll()`.
7. Navigate to **AI Advisor** — chat goes through `aiService.chat(...)`.
8. Navigate to **Tasks / Evaluation** — submit a file. `aiService.evaluateSubmission(...)`
   returns a 5-dimensional NEP-2020 rubric. The submission is persisted to
   the `Submission` collection.
9. Navigate to **Progress & Insights** — the dashboard is hydrated from
   `progressService.get()` and the new submission's scores.

---

## What was *not* changed

To honour the "do not redesign the UI" mandate, the following files have
**byte-identical JSX** to the prototype. Only the data wiring behind them
was swapped out:

- `src/components/HomeView.tsx`
- `src/components/RoadmapView.tsx`
- `src/components/MentorView.tsx`
- `src/components/OnboardingView.tsx`
- `src/components/ProgressInsightsView.tsx`
- `src/components/LoginView.tsx`
- `src/components/DashboardView.tsx` (its imports and one state hydration line
  changed; the JSX is identical)
- `src/components/EvaluationView.tsx` (only the data-fetch block was changed;
  the JSX is identical)
- `src/utils/pdfGenerator.ts`
- `src/types.ts`
- `src/main.tsx`
- `src/index.css`

The styling, animations, layout, language toggle, dark theme, NEP-2020
badges, sandbox output, spaced-repetition quiz UI, "Recalibrate Path"
button, and all other visual details are preserved exactly.
