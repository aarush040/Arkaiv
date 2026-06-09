# ARKAIV — REST API Documentation

All API endpoints are exposed by the Express+TypeScript backend in
`backend/src/`. Every endpoint except `GET /api/health` and the auth endpoints
that mint tokens requires a valid JWT in the `Authorization: Bearer <token>`
header.

Base URL (development): **`http://localhost:3000/api`**

---

## Table of Contents

- [Authentication](#authentication)
  - [POST /api/auth/register](#post-apiauthregister)
  - [POST /api/auth/login](#post-apiauthlogin)
  - [POST /api/auth/refresh](#post-apiauthrefresh)
  - [GET  /api/auth/me](#get-apiauthme)
  - [POST /api/auth/logout](#post-apiauthlogout)
  - [GET  /api/auth/google](#get-apiauthgoogle)
  - [GET  /api/auth/google/callback](#get-apiauthgooglecallback)
  - [POST /api/auth/google](#post-apiauthgoogle)
- [Tasks](#tasks)
- [Roadmaps](#roadmaps)
- [Progress](#progress)
- [AI](#ai)
- [Health](#health)

---

## Authentication

All authentication flows are implemented in `backend/src/controllers/authController.ts`
and routed in `backend/src/routes/auth.ts`. JWTs are signed with the
`JWT_SECRET` env var (access, 15 min) and `JWT_REFRESH_SECRET` (refresh, 7 d).

### `POST /api/auth/register`

Register a new local account.

**Request body**

```json
{
  "name": "Priya Verma",
  "email": "priya.verma@nitap.edu.in",
  "password": "StartupPass2026!",
  "phone": "+91 98765 43210"
}
```

**Response 201**

```json
{
  "user": {
    "_id": "66f7a8...",
    "name": "Priya Verma",
    "email": "priya.verma@nitap.edu.in",
    "phone": "+91 98765 43210",
    "createdAt": "2026-06-08T10:00:00.000Z",
    "updatedAt": "2026-06-08T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

**Errors**

- `400` — Missing field or password < 6 chars.
- `409` — Email already in use.

---

### `POST /api/auth/login`

Authenticate with email + password.

**Request body**

```json
{ "email": "priya.verma@nitap.edu.in", "password": "StartupPass2026!" }
```

**Response 200** — same shape as `/register`.

**Errors**

- `400` — Missing email or password.
- `401` — Invalid credentials.

---

### `POST /api/auth/refresh`

Exchange a valid refresh token for a new pair of access + refresh tokens. The
old refresh token is invalidated server-side.

**Request body**

```json
{ "refreshToken": "eyJhbGciOi..." }
```

**Response 200**

```json
{ "accessToken": "eyJhbGciOi...", "refreshToken": "eyJhbGciOi..." }
```

**Errors**

- `400` — Missing token.
- `403` — Invalid or revoked refresh token.

---

### `GET /api/auth/me`

Return the currently authenticated user.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Response 200**

```json
{
  "_id": "66f7a8...",
  "name": "Priya Verma",
  "email": "priya.verma@nitap.edu.in",
  "phone": "+91 98765 43210",
  "createdAt": "2026-06-08T10:00:00.000Z",
  "updatedAt": "2026-06-08T10:00:00.000Z"
}
```

**Errors**

- `401` — Not authenticated.
- `404` — User not found.

---

### `POST /api/auth/logout`

Invalidate the current user's refresh token.

**Response 200**

```json
{ "message": "Logged out successfully" }
```

---

### `GET /api/auth/google`

Initiate the Google OAuth 2.0 redirect flow. The browser is redirected to
Google. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the backend
`.env`. If they are missing, the endpoint returns `501` with an explanatory
error.

---

### `GET /api/auth/google/callback`

OAuth callback. Issues a fresh pair of JWTs and redirects to
`${FRONTEND_URL}/auth/callback?accessToken=...&refreshToken=...`.

---

### `POST /api/auth/google`

Programmatic Google sign-in. Used by the frontend if it already has a Google
ID token (e.g. from Google Identity Services).

**Request body**

```json
{ "googleId": "1234567890", "name": "Priya Verma", "email": "priya@example.com", "avatar": "https://..." }
```

**Response 200** — same shape as `/login`.

---

## Tasks

Routed in `backend/src/routes/tasks.ts`. All endpoints require a valid JWT.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/tasks` | — | `Task[]` for the current user. |
| `POST` | `/api/tasks` | `{ title, description?, category?, difficulty?, duration?, dueDate? }` | The created `Task`. |
| `PUT` | `/api/tasks/:id` | Partial `Task` | The updated `Task`. |
| `DELETE` | `/api/tasks/:id` | — | `{ message: "Task deleted successfully" }` |

A `Task` document looks like:

```ts
{
  _id: string,
  userId: string,
  title: string,
  description?: string,
  category?: string,
  difficulty: 'easy' | 'medium' | 'hard',
  duration?: string,
  dueDate?: Date,
  completed: boolean,
  order: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Roadmaps

Routed in `backend/src/routes/roadmap.ts`. All endpoints require a valid JWT.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/roadmaps` | — | `Roadmap[]` for the current user. |
| `POST` | `/api/roadmaps` | `{ goal, level?, commitment?, duration? }` | The created `Roadmap`. |
| `PUT` | `/api/roadmaps/:id` | Partial `Roadmap` (incl. `steps[]`, `progress`) | The updated `Roadmap`. |
| `PUT` | `/api/roadmaps/:id/steps/:stepId` | `{ completed: boolean }` | The updated `Roadmap` with recalculated `progress`. |

A `Roadmap` document looks like:

```ts
{
  _id: string,
  userId: string,
  goal: string,
  level?: string,
  commitment?: number,
  duration?: number,
  progress: number,        // 0-100
  steps: Array<{
    _id: string,
    title: string,
    description?: string,
    duration?: string,
    completed: boolean,
    order: number
  }>,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Progress

Routed in `backend/src/routes/progress.ts`. All endpoints require a valid JWT.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/progress` | — | The current user's `Progress` (or `{}` if none). |
| `PUT` | `/api/progress` | Partial `Progress` | The upserted `Progress`. |
| `POST` | `/api/progress` | Partial `Progress` | Same as PUT. |
| `POST` | `/api/progress/upload-marksheet` | `multipart/form-data` with `marksheet` field | The updated `Progress` with `marksheetUploaded: true`. |
| `POST` | `/api/progress/sync-platform` | `{ platform: 'SWAYAM' \| 'DIKSHA' \| 'NCERT' }` | The updated `Progress`. |

A `Progress` document looks like:

```ts
{
  _id: string,
  userId: string,
  goal?: string,
  level?: string,
  commitment?: number,
  duration?: number,
  marksheetUploaded: boolean,
  marksheetName?: string,
  streak: number,
  xp: number,
  overallProgress: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## AI

Routed in `backend/src/routes/ai.ts`. All endpoints require a valid JWT.
The frontend **never** calls an AI provider directly — every request is
routed through these endpoints. The backend owns the `@google/genai` client.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/api/ai/chat` | `{ message, previousMessages?, userGoal?, userLevel?, context? }` | `{ text, mode: 'gemini' \| 'simulated' }` |
| `POST` | `/api/ai/generate-roadmap` | `{ goal, duration?, level? }` | `{ steps: Array<{ title, description, order, completed, duration? }> }` |
| `POST` | `/api/ai/generate-quiz` | `{ topic, difficulty?, numQuestions? }` | `{ questions: Array<{ question, options, correctAnswer, explanation? }> }` |
| `POST` | `/api/ai/review` | — | `{ review: string }` |
| `POST` | `/api/ai/evaluate` | `{ fileName, selectedMissionId?, userGoal? }` | 5-dimensional NEP-2020 rubric (see below). |

The `/api/ai/evaluate` response shape (kept identical to the old root
`server.ts` for compatibility with `EvaluationView`):

```ts
{
  fileName: string,
  selectedTaskId: string,
  selectedTaskName: string,
  isMatch: boolean,
  grade: string,                 // e.g. "A (92/100)" or "Not Graded"
  scores: {
    understanding: number,      // 0-10
    conceptualClarity: number,   // 0-10
    execution: number,          // 0-10
    nepCompliance: number,      // 0-10
    careerRelevance: number     // 0-10
  },
  feedback?: string,
  reasons?: string[],            // populated when isMatch=false
  insights?: Array<{ title: string; desc: string }>
}
```

---

## Health

### `GET /api/health`

No authentication required.

**Response 200**

```json
{
  "status": "ok",
  "timestamp": "2026-06-08T10:00:00.000Z",
  "environment": "development"
}
```

---

## Error Envelope

All non-2xx responses use a single shape:

```ts
{ "error": "Human-readable error message" }
```

`401` means the access token is missing/expired. `403` means the token is
invalid. `409` is used for duplicate-key errors. `429` is reserved for future
rate-limiting. The frontend `apiClient` interceptor in `src/services/apiClient.ts`
automatically clears the JWTs and redirects to `/login` on `401` or `403`.
