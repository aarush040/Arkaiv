# ARKAIV — Production-ready Full-stack Application

> **One-Stop Personalized Career & Education Advisor** — Smart India
> Hackathon 2026, aligned with NEP 2020.

ARKAIV is a full-stack TypeScript application that turns a static React
prototype into a production-ready SaaS. The frontend (Vite + React 19 +
TypeScript + Tailwind v4) is preserved **byte-identically**; the backend
(Express + TypeScript + MongoDB + JWT + Google OAuth 2.0) owns all
business logic and all third-party AI calls.

```
┌──────────────────────┐    JWT / REST    ┌──────────────────────┐    Mongoose    ┌──────────────┐
│  React 19 + Vite SPA │ ───────────────► │ Express + TS backend │ ────────────► │ MongoDB Atlas│
│  src/services/*      │                  │ backend/src/*        │                └──────────────┘
└──────────────────────┘                  └──────────────────────┘
                                                       │
                                                       │ Gemini (only place AI is called)
                                                       ▼
                                                ┌──────────────┐
                                                │  Gemini API  │
                                                └──────────────┘
```

> **The frontend never talks to MongoDB, JWT, or an AI provider directly.**
> Every screen is wired to a real endpoint through `src/services/*`.

---

## Quick start

### 1. Install

```bash
npm install
```

### 2. Configure

Edit `.env` in the project root:

```dotenv
# Frontend
VITE_API_URL=http://localhost:3000/api

# Backend
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/arkaiv
JWT_SECRET=<random 64 bytes>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from console.cloud.google.com>
GEMINI_API_KEY=<from aistudio.google.com/apikey>
```

`MONGODB_URI` is the only strictly-required env var for the backend to
boot. The server will start without it (in-memory mode) but data will
not persist.

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are required for the
Google OAuth redirect flow. Without them, `GET /api/auth/google` returns
`501` and the local email/password flow is still available.

`GEMINI_API_KEY` is optional. Without it, the AI endpoints return a
deterministic curriculum-aware simulator response (so the app remains
fully usable).

### 3. Run

```bash
# Full stack (Express + Vite middleware, single process, HMR enabled)
npm run dev

# Frontend only (Vite, hits the backend on :3000)
npm run dev:frontend

# Backend only (Express, with auto-restart)
npm run dev:backend
```

Open `http://localhost:3000` (or `http://localhost:5173` if you used
`npm run dev:frontend`).

### 4. Build for production

```bash
npm run build
npm start
```

`npm run build` produces a static SPA in `dist/` and a bundled CJS server
in `dist/server.cjs`. `npm start` runs the server, which serves the SPA
and exposes the API on the same port.

---

## Architecture

See **[`ARCHITECTURE_REPORT.md`](./ARCHITECTURE_REPORT.md)** for the
complete map. Highlights:

- **Frontend** is a clean Vite + React 19 + TypeScript SPA. The only
  Axios instance in the app is `src/services/apiClient.ts`. All
  business operations go through one of five services:
  `authService`, `taskService`, `roadmapService`, `progressService`,
  `aiService`.
- **Backend** is Express + TypeScript. Mongoose models in
  `backend/src/models/` (User, Task, Roadmap, Progress, Submission,
  Quiz, StudyTopic, Streak). Routers in `backend/src/routes/`. The
  only file in the repo that imports `@google/genai` is
  `backend/src/services/aiService.ts`.
- **Auth** is JWT (HS256). Access token TTL 15 min, refresh token TTL
  7 d. Google OAuth 2.0 is fully wired (both redirect flow and
  programmatic POST).
- **No UI changes** from the prototype. The visual output is identical.

---

## Documentation

| Doc | What it covers |
| --- | --- |
| **[`ARCHITECTURE_REPORT.md`](./ARCHITECTURE_REPORT.md)** | High-level architecture, sequence diagrams, file inventory, security, deployment, how to run. |
| **[`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)** | Every REST endpoint with request/response shapes and error codes. |
| **[`MONGO_SCHEMAS.md`](./MONGO_SCHEMAS.md)** | Every Mongoose model, field-by-field, plus an entity-relationship diagram. |
| **[`FRONTEND_AUDIT.md`](./FRONTEND_AUDIT.md)** | Line-by-line audit of every mock / hardcoded user / `localStorage` read that was removed. |
| **[`MIGRATION_NOTES.md`](./MIGRATION_NOTES.md)** | Step-by-step diff of the prototype → production migration, plus a smoke-test recipe. |

---

## Repository layout

```
arkaiv/
├── src/                          # Frontend SPA (Vite + React 19 + TS)
│   ├── App.tsx
│   ├── components/               # 8 views — JSX is byte-identical to the prototype
│   ├── services/                 # apiClient + 5 domain services
│   ├── utils/                    # jsPDF helper + legacy demo data
│   └── types.ts
├── backend/src/                  # Express + TS REST API
│   ├── server.ts                 # bootstraps Express + (Vite | dist)
│   ├── config/                   # db.ts, passport.ts
│   ├── controllers/              # 5 controllers
│   ├── middleware/               # auth.ts, errorHandler.ts
│   ├── models/                   # 8 Mongoose models
│   ├── routes/                   # 5 routers
│   ├── services/                 # aiService.ts (Gemini) + 3 game-loop services
│   ├── types/                    # express.d.ts
│   └── utils/                    # tokens.ts (JWT)
├── frontend/                     # Mirror of root src/services (consumed by separate Vite)
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
├── .env                          # VITE_API_URL=http://localhost:3000/api
├── ARCHITECTURE_REPORT.md
├── API_DOCUMENTATION.md
├── MONGO_SCHEMAS.md
├── FRONTEND_AUDIT.md
└── MIGRATION_NOTES.md
```

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Express + Vite middleware in one process (HMR). |
| `npm run dev:frontend` | Vite only, on port 5173. |
| `npm run dev:backend` | Express only with `tsx watch`, on port 3000. |
| `npm run build` | Vite build + esbuild server bundle into `dist/`. |
| `npm start` | Run the production server (CJS bundle). |
| `npm run clean` | Remove `dist/` and `server.js`. |
| `npm run lint` | TypeScript no-emit check. |

---

## License

Apache-2.0 (per the SPDX header in `src/App.tsx`).
