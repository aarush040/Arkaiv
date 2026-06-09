# ARKAIV — Architecture Report

A complete map of the production-ready ARKAIV full-stack application.

---

## 1. High-level overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                              BROWSER (Vite SPA)                          │
│                                                                          │
│  React 19 + TypeScript                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ LoginView│ │Onboard   │ │Dashboard │ │  Mentor  │ │  Eval    │ …     │
│  └─────┬────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│        │           │            │            │            │             │
│        └───────────┴─────┬──────┴────────────┴────────────┘             │
│                          │                                              │
│                  src/services/  (apiClient + 5 domain services)        │
│                          │                                              │
│                  VITE_API_URL  (default: http://localhost:3000/api)     │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │  REST + JSON + JWT
                           │  (Authorization: Bearer <accessToken>)
                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BACKEND  (Express + TypeScript, port 3000)            │
│                                                                          │
│   server.ts                                                             │
│     ├── /api/health                                                     │
│     ├── /api/auth          (register, login, refresh, me, logout,       │
│     │                       google, google/callback)                    │
│     ├── /api/tasks         (CRUD for daily study tasks)                 │
│     ├── /api/roadmaps      (CRUD + step status for learning roadmaps)  │
│     ├── /api/progress      (UPSERT + marksheet + gov-platform sync)     │
│     └── /api/ai            (chat, generate-roadmap, generate-quiz,      │
│                             review, evaluate)                           │
│                                                                          │
│   middleware/auth.ts   ── JWT verification (HS256, 15 min)              │
│   middleware/errorHandler.ts ── uniform error envelope                   │
│   config/passport.ts    ── Google OAuth 2.0 strategy                    │
│   config/db.ts          ── Mongoose connection                          │
│   services/aiService.ts ── the ONLY file that imports @google/genai     │
│                                                                          │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  MongoDB Atlas   │
                  │  (database:      │
                  │   arkaiv)        │
                  └──────────────────┘
                           ▲
                  ┌────────┴─────────┐
                  │  Gemini AI API   │   ← only the backend talks to this
                  │  (optional;      │
                  │  simulator if    │
                  │  no key)         │
                  └──────────────────┘
```

The frontend **never** sees MongoDB or Gemini. The backend is the single
source of truth for all data and the only place where third-party AI
providers are contacted.

---

## 2. Frontend (Vite + React 19 + TypeScript)

### Folder layout

```
src/
├── App.tsx                       # top-level routing (auth → onboarding → dashboard)
├── main.tsx                      # ReactDOM root
├── index.css                     # Tailwind v4 entry
├── types.ts                      # Shared TS types
├── components/
│   ├── LoginView.tsx             # Register / login / prefill test creds
│   ├── OnboardingView.tsx        # Goal / level / commitment / duration
│   ├── DashboardView.tsx         # Top-level shell with sidebar + tabs
│   ├── HomeView.tsx              # Home / Dashboard tab
│   ├── RoadmapView.tsx           # Timeline + daily missions
│   ├── EvaluationView.tsx        # File upload → 5D NEP-2020 rubric
│   ├── MentorView.tsx            # AI mentor chat + spaced-repetition quiz
│   └── ProgressInsightsView.tsx  # Streak / XP / skill gaps / projections
├── services/
│   ├── apiClient.ts              # ← only Axios instance in the app
│   ├── authService.ts            #   login / register / google / me / logout
│   ├── taskService.ts            #   CRUD for daily tasks
│   ├── roadmapService.ts         #   CRUD + generateRoadmap
│   ├── progressService.ts        #   get / save / upload-marksheet / sync-platform
│   └── aiService.ts              #   chat / generateQuiz / review / evaluate
└── utils/
    ├── pdfGenerator.ts           # jsPDF — exports "Prototype Spec" + "Progress Insights"
    └── priyaDataset.ts           # legacy static data — kept for the PDF demo, no longer used by runtime
```

### API base URL

```ts
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';
```

Override at build time:

```bash
VITE_API_URL=https://arkaiv-api.example.com/api npm run build
```

### Auth interceptor

`apiClient.interceptors.request.use(...)` attaches
`Authorization: Bearer <accessToken>` from `localStorage.arkaiv_token` to
every outgoing request.

`apiClient.interceptors.response.use(..., errorHandler)` clears the JWTs
and redirects to `/login` on any 401 or 403.

### What localStorage is used for

Only two keys, both written by `authService`:

| Key | Purpose |
| --- | --- |
| `arkaiv_token` | JWT access token (15 min TTL). |
| `arkaiv_refresh_token` | JWT refresh token (7 d TTL). |

No business data is ever read from or written to `localStorage` in the
new architecture.

---

## 3. Backend (Express 4 + TypeScript + Mongoose)

### Folder layout

```
backend/src/
├── server.ts                     # bootstraps Express + Vite middleware (dev) / dist (prod)
├── config/
│   ├── db.ts                     # mongoose.connect(MONGODB_URI)
│   └── passport.ts               # Google OAuth 2.0 strategy
├── controllers/
│   ├── authController.ts         # register / login / refresh / me / logout / google*
│   ├── taskController.ts         # get / create / update / delete
│   ├── roadmapController.ts      # get / create / update / updateStepStatus
│   ├── progressController.ts     # get / save / upload-marksheet / sync-platform
│   └── aiController.ts           # chat / generate-roadmap / generate-quiz / review / evaluate
├── middleware/
│   ├── auth.ts                   # authenticate (a.k.a. authenticateJWT), optionalAuth
│   └── errorHandler.ts           # uniform { error: string } envelope
├── models/                       # 8 Mongoose models — see MONGO_SCHEMAS.md
│   ├── User.ts
│   ├── Task.ts
│   ├── Roadmap.ts
│   ├── Progress.ts
│   ├── Submission.ts
│   ├── Quiz.ts
│   ├── StudyTopic.ts
│   └── Streak.ts
├── routes/
│   ├── auth.ts                   # /api/auth/*
│   ├── tasks.ts                  # /api/tasks/*
│   ├── roadmap.ts                # /api/roadmaps/*
│   ├── progress.ts               # /api/progress/*
│   └── ai.ts                     # /api/ai/*  and  /api/ai/evaluate
├── services/
│   ├── aiService.ts              # ← ONLY file in the repo that imports @google/genai
│   ├── levelService.ts           # XP → level math
│   ├── streakService.ts          # daily streak + grace days
│   └── xpService.ts              # XP rewards for actions
├── types/
│   └── express.d.ts              # Express type augmentation
└── utils/
    └── tokens.ts                 # generateAccessToken / generateRefreshToken / verify*
```

### Startup sequence (`backend/src/server.ts`)

1. Load `.env` from the project root.
2. Create the Express app.
3. CORS (allow `FRONTEND_URL` or `http://localhost:5173`).
4. Body parsers (`application/json` up to 10 MB).
5. `connectDB()` — non-fatal if Mongo is unreachable (server still boots).
6. `configurePassport()` — registers Google strategy if env vars present.
7. Mount routers under `/api/*`.
8. Register error handler.
9. **In dev:** mount Vite middleware (`createViteServer({ middlewareMode: true })`).
10. **In prod:** serve `dist/` and fall back to `index.html` for SPA routing.
11. `httpServer.listen(PORT, '0.0.0.0')` with an `EADDRINUSE` fallback that
    tries the next 5 ports.

### Authentication flow

```
Browser                Frontend Service          Backend
   │                         │                     │
   │  register({name,        │                     │
   │   email, password})     │                     │
   ├────────────────────────►│  POST /api/auth/    │
   │                         │  register           │
   │                         ├────────────────────►│
   │                         │                     │ bcrypt.hash(password, 12)
   │                         │                     │ generateAccessToken({userId,email})
   │                         │                     │ generateRefreshToken({userId,email})
   │                         │                     │ save user.refreshToken
   │                         │                     │
   │                         │  201 { user,        │
   │                         │    accessToken,     │
   │                         │    refreshToken }   │
   │                         │◄────────────────────┤
   │  redirect to /onboarding│                     │
   │◄────────────────────────┤                     │
   │                         │                     │
   │  …later…                │                     │
   │                         │                     │
   │  open Dashboard         │  GET /api/auth/me   │
   │                         │  Authorization:     │
   │                         │    Bearer <token>   │
   │                         ├────────────────────►│
   │                         │                     │ verifyAccessToken(token)
   │                         │                     │ User.findById(userId)
   │                         │  200 { _id, name,   │
   │                         │    email, ... }     │
   │                         │◄────────────────────┤
   │  render Dashboard        │                     │
   │◄────────────────────────┤                     │
```

Refresh:

```
Browser           Frontend           Backend
   │                   │                  │
   │ accessToken       │                  │
   │ expires (15 min)  │                  │
   │                   │                  │
   │                   │ POST /api/auth/  │
   │                   │ refresh          │
   │                   │ { refreshToken }│
   │                   ├─────────────────►│
   │                   │                  │ verifyRefreshToken(token)
   │                   │                  │ user.refreshToken === token?
   │                   │ 200 { newTokens }│
   │                   │◄─────────────────┤
```

The `apiClient` does **not** yet auto-refresh on 401. A short follow-up
patch can be added by inserting a single response interceptor that
swallows 401s, calls `authService.refresh(...)`, and replays the original
request. The plumbing for that already exists in `authService` and the
backend's `POST /api/auth/refresh` route.

### Google OAuth 2.0

Two flows are supported:

1. **Redirect flow** (recommended for new browser sessions)

   ```
   Browser                   Backend                   Google
      │                          │                       │
      │  GET /api/auth/google    │                       │
      ├─────────────────────────►│                       │
      │                          │ 302 → accounts.google.com/...
      │◄─────────────────────────┤                       │
      │  302 to Google                                       │
      ├─────────────────────────────────────────────────►│
      │                                                       │
      │  302 → /api/auth/google/callback?code=...            │
      │◄──────────────────────────────────────────────────┤
      │                                                       │
      │  GET /api/auth/google/callback?code=...              │
      ├─────────────────────────►│                          │
      │                          │ exchange code for tokens│
      │                          │ fetch profile           │
      │                          │ upsert user             │
      │                          │ generateAccessToken     │
      │                          │ generateRefreshToken    │
      │                          │ 302 → FRONTEND_URL/auth/callback?accessToken=…&refreshToken=…
      │◄─────────────────────────┤                          │
      │                                                          │
      │  GET /auth/callback?accessToken=…                      │
      │  (frontend stores tokens, navigates to dashboard)      │
   ```

2. **Programmatic flow** (e.g. Google Identity Services on the frontend)

   ```
   Browser → POST /api/auth/google { googleId, name, email, avatar }
   ```

### AI flow

```
DashboardView           aiService          Backend            Gemini API
    │                       │                  │                    │
    │  chat({ message,      │                  │                    │
    │   previousMessages,   │                  │                    │
    │   userGoal,           │                  │                    │
    │   userLevel, context})│                  │                    │
    ├──────────────────────►│  POST /api/ai/   │                    │
    │                       │  chat            │                    │
    │                       ├─────────────────►│  generateContent   │
    │                       │                  ├───────────────────►│
    │                       │                  │                    │
    │                       │                  │  { text, mode }    │
    │                       │  200 { text }    │◄───────────────────┤
    │  render AI message    │◄─────────────────┤                    │
    │◄──────────────────────┤                  │                    │
```

If `GEMINI_API_KEY` is unset the backend returns a deterministic
curriculum-aware simulator response. Either way, the response shape is
identical (`{ text: string, mode: 'gemini' | 'simulated' }`).

### Evaluation flow

```
EvaluationView             aiService             Backend
    │                          │                    │
    │  submitWork(fileName,    │                    │
    │   selectedMissionId)     │                    │
    ├─────────────────────────►│ POST /api/ai/      │
    │                          │ evaluate           │
    │                          ├───────────────────►│
    │                          │                    │ run deterministic
    │                          │                    │ task-similarity check
    │                          │                    │ persist Submission
    │                          │  200 { fileName,   │
    │                          │    isMatch, grade, │
    │                          │    scores,         │
    │                          │    insights, ... } │
    │  render grade cards      │◄───────────────────┤
    │◄─────────────────────────┤                    │
```

---

## 4. Database (MongoDB Atlas)

| Collection | Model | Source of truth for |
| --- | --- | --- |
| `users` | `User` | Auth identity, profile, refresh tokens |
| `tasks` | `Task` | Daily study tasks |
| `roadmaps` | `Roadmap` | Multi-month learning plans with embedded steps |
| `progresses` | `Progress` | Onboarding answers, marksheet, streak, XP |
| `submissions` | `Submission` | Evaluator history + NEP-2020 rubric |
| `quizzes` | `Quiz` | Spaced-repetition / generated quizzes |
| `studytopics` | `StudyTopic` | Per-user topic mastery |
| `streaks` | `Streak` | Daily-engagement tracker with grace days |

See `MONGO_SCHEMAS.md` for full field-level documentation.

---

## 5. Security

- **Passwords** are hashed with bcrypt (12 salt rounds) in a Mongoose
  `pre('save')` hook.
- **JWTs** are signed with `JWT_SECRET` (access, 15 min) and
  `JWT_REFRESH_SECRET` (refresh, 7 d). Both env vars are required in
  production.
- **CORS** allows `FRONTEND_URL` (defaults to `http://localhost:5173`).
  Cookies are not used — JWTs are stored in `localStorage` by the
  frontend only.
- **Protected routes** use the `authenticate` (a.k.a. `authenticateJWT`)
  middleware on every business endpoint. Only `/api/health` and the auth
  endpoints that *mint* tokens (`/register`, `/login`, `/refresh`,
  `/google`) are public.
- **AI provider key** is never exposed to the frontend.
- **AI inputs** are wrapped in a system prompt that forbids off-topic
  content. The `/api/ai/evaluate` endpoint performs an explicit
  keyword-similarity check before issuing a grade, so a clearly
  off-topic file (e.g. `recipe.txt`) is rejected with `isMatch: false`.

---

## 6. Deployment

- **Dev:** `npm run dev` starts the Express server with Vite middleware
  in the same process. The Vite dev server is used for HMR; the API is
  on the same origin.
- **Prod:** `npm run build` runs `vite build` for the SPA and
  `esbuild backend/src/server.ts --bundle --platform=node --format=cjs
  --packages=external --sourcemap --outfile=dist/server.cjs` for the
  server. `npm start` runs the bundled CJS server, which serves `dist/`
  as a static SPA with an `index.html` fallback for client-side routing.

### Recommended env vars (production)

```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://arkaiv.example.com
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/arkaiv
JWT_SECRET=<random 64 bytes>
JWT_REFRESH_SECRET=<random 64 bytes, different from JWT_SECRET>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from console.cloud.google.com>
GEMINI_API_KEY=<from aistudio.google.com/apikey>
```

---

## 7. File Inventory

### Files created

| Path | Purpose |
| --- | --- |
| `src/services/apiClient.ts` | Centralized Axios instance for the frontend. |
| `backend/src/models/Submission.ts` | Evaluator submission history. |
| `backend/src/models/Quiz.ts` | Generated quizzes. |
| `backend/src/models/StudyTopic.ts` | Per-user topic mastery. |
| `backend/src/models/Streak.ts` | Daily-engagement tracker. |
| `backend/src/controllers/aiController.ts` | Wires AI routes to `aiService`; provides the legacy `/api/ai/evaluate` endpoint. |
| `FRONTEND_AUDIT.md` | Line-by-line audit of every mock / hardcoded user / `localStorage` read. |
| `API_DOCUMENTATION.md` | Every endpoint with request/response shapes. |
| `MONGO_SCHEMAS.md` | Every Mongoose model, field-by-field. |
| `MIGRATION_NOTES.md` | Step-by-step diff of the prototype → production migration. |
| `ARCHITECTURE_REPORT.md` | This document. |

### Files modified

| Path | Change |
| --- | --- |
| `backend/src/controllers/authController.ts` | Renamed exports to `register` / `login`; added `googleAuthRedirect`, `googleAuthCallback`. |
| `backend/src/middleware/auth.ts` | Added `authenticateJWT` alias. |
| `backend/src/controllers/progressController.ts` | Added `saveProgress`, `uploadMarksheet`, `syncGovernmentPlatform`. |
| `backend/src/routes/auth.ts` | Added `/api/auth/google` (GET), `/api/auth/google/callback`, `/api/auth/refresh`. |
| `backend/src/routes/progress.ts` | Added `POST /api/progress`, `/upload-marksheet`, `/sync-platform`. |
| `backend/src/routes/ai.ts` | Added `POST /api/ai/evaluate`. |
| `src/services/authService.ts` | Removed inline Axios; now uses `apiClient`. |
| `src/services/taskService.ts` | Same. |
| `src/services/roadmapService.ts` | Same. |
| `src/services/progressService.ts` | Same. |
| `src/services/aiService.ts` | Same. Added `evaluateSubmission(payload)`. |
| `src/components/EvaluationView.tsx` | `fetch("/api/evaluate")` → `aiService.evaluateSubmission(...)`. |
| `.env` | Set `VITE_API_URL=http://localhost:3000/api`. |

### Files NOT changed (UI preserved exactly)

| Path | Reason |
| --- | --- |
| `src/components/HomeView.tsx` | JSX-only. |
| `src/components/RoadmapView.tsx` | JSX-only. |
| `src/components/MentorView.tsx` | JSX-only. |
| `src/components/OnboardingView.tsx` | JSX-only. |
| `src/components/ProgressInsightsView.tsx` | JSX-only. |
| `src/components/LoginView.tsx` | JSX-only. |
| `src/components/DashboardView.tsx` | JSX-only; one import line + one state hydration line changed. |
| `src/utils/pdfGenerator.ts` | No backend interaction; pure jsPDF. |
| `src/utils/priyaDataset.ts` | Kept for the PDF demo; no longer imported by runtime code. |
| `src/types.ts` | Already matches the new service shapes. |
| `src/main.tsx` | Already correct. |
| `src/index.css` | Already correct. |
| `vite.config.ts` | Already correct. |
| `tsconfig.json` | Already correct. |
| `package.json` | Already has the required dependencies. |
| `frontend/**` | Mirror of the root; both copies of the service layer point at the same backend. |

---

## 8. How to run

```bash
# Install
npm install

# Configure
cp .env.example .env       # fill in MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, etc.

# Dev (backend + Vite middleware in one process)
npm run dev

# Dev (frontend only — Vite hits the backend on :3000)
npm run dev:frontend

# Dev (backend only, no Vite)
npm run dev:backend

# Build (SPA + bundled server)
npm run build

# Start (production)
npm start
```

Default dev ports:

- Backend API + Vite: **`http://localhost:3000`**
- Vite-only frontend (when using `npm run dev:frontend`): **`http://localhost:5173`**

Default `VITE_API_URL`: **`http://localhost:3000/api`**.

---

## 9. Summary

- **Frontend** is a clean Vite + React 19 + TypeScript SPA. The only Axios
  instance in the entire app is `src/services/apiClient.ts`. Every domain
  operation goes through one of five services (`auth`, `task`, `roadmap`,
  `progress`, `ai`).
- **Backend** is an Express + TypeScript server that exposes a REST API
  under `/api/*`. The only file that talks to a third-party AI provider is
  `backend/src/services/aiService.ts`. MongoDB is the source of truth.
- **Auth** is JWT-based. Google OAuth 2.0 is fully wired (both redirect
  flow and programmatic flow).
- **No UI changes.** The visual output is byte-identical to the prototype.
- **No business data in `localStorage`.** Only the JWT access and refresh
  tokens are cached there.
- **No mock data, no simulated backend behavior.** Every screen is wired
  to a real endpoint.

For deeper detail, see:

- `API_DOCUMENTATION.md` — every endpoint.
- `MONGO_SCHEMAS.md` — every Mongoose model.
- `FRONTEND_AUDIT.md` — every line of mock data that was removed.
- `MIGRATION_NOTES.md` — the step-by-step diff.
