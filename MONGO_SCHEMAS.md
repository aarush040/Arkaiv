# ARKAIV — MongoDB Schema Documentation

This document describes every Mongoose model that lives in the ARKAIV
production database (Atlas by default). The on-disk source is in
`backend/src/models/*.ts`.

**Database name:** `arkaiv` (configurable via the path in `MONGODB_URI`)

**Connection string env var:** `MONGODB_URI`

> MongoDB Atlas is the source of truth for all user data. No business data
> is stored in `localStorage` on the frontend.

---

## 1. `users` — User

`backend/src/models/User.ts`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `name` | `String` | yes | Trimmed. |
| `email` | `String` | yes | Unique, lowercased, trimmed. |
| `phone` | `String` | no | Trimmed. |
| `password` | `String` | no | Bcrypt-hashed with 12 salt rounds in a `pre('save')` hook. Never returned in JSON (`toJSON` transform). |
| `googleId` | `String` | no | Sparse unique index. |
| `avatar` | `String` | no | URL or path. |
| `refreshToken` | `String` | no | Hashed JWT refresh token. Never returned in JSON. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- `{ email: 1 }` unique
- `{ googleId: 1 }` sparse unique

**Instance methods**

- `comparePassword(candidate: string): Promise<boolean>` — bcrypt compare.

---

## 2. `tasks` — Task

`backend/src/models/Task.ts`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | Indexed. |
| `title` | `String` | yes | Trimmed. |
| `description` | `String` | no | Trimmed. |
| `category` | `String` | no | Trimmed. e.g. `"Data Structures & Algorithms"`. |
| `difficulty` | `Enum` | no | `easy` / `medium` / `hard`. Default `medium`. |
| `duration` | `String` | no | e.g. `"40 min"`. |
| `dueDate` | `Date` | no | |
| `completed` | `Boolean` | no | Default `false`. |
| `order` | `Number` | no | Default `0`. Used for stable ordering. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- `{ userId: 1 }`
- `{ userId: 1, order: 1 }`

---

## 3. `roadmaps` — Roadmap

`backend/src/models/Roadmap.ts`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | Indexed. |
| `goal` | `String` | yes | Trimmed. e.g. `"Become a Full-Stack Developer"`. |
| `level` | `String` | no | e.g. `"B.Tech 2nd Year"`. |
| `commitment` | `Number` | no | Hours per day. |
| `duration` | `Number` | no | Months. |
| `progress` | `Number` | no | 0-100. Default 0. Auto-recalculated from `steps`. |
| `steps` | `Array<IRoadmapStep>` | no | See below. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**`IRoadmapStep` (subdocument)**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `title` | `String` | yes | |
| `description` | `String` | no | Default `""`. |
| `duration` | `String` | no | e.g. `"2 weeks"`. |
| `completed` | `Boolean` | no | Default `false`. |
| `order` | `Number` | no | Default `0`. |

**Indexes**

- `{ userId: 1 }`

---

## 4. `progresses` — Progress

`backend/src/models/Progress.ts`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | **Unique** — one progress document per user. |
| `goal` | `String` | no | |
| `level` | `String` | no | |
| `commitment` | `Number` | no | |
| `duration` | `Number` | no | |
| `marksheetUploaded` | `Boolean` | no | Default `false`. |
| `marksheetName` | `String` | no | Original filename. |
| `streak` | `Number` | no | Default `0`. Updated by `streakService`. |
| `xp` | `Number` | no | Default `0`. Updated by `xpService`. |
| `overallProgress` | `Number` | no | 0-100. Default `0`. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- `{ userId: 1 }` unique

---

## 5. `submissions` — Submission

`backend/src/models/Submission.ts`

A history of every file the user has uploaded to the Evaluator.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | Indexed. |
| `fileName` | `String` | yes | |
| `size` | `String` | no | Pretty-formatted size. |
| `type` | `Enum` | no | `doc` / `link`. Default `doc`. |
| `status` | `Enum` | no | `completed` / `pending` / `failed`. Default `pending`. |
| `taskName` | `String` | no | |
| `taskId` | `String` | no | |
| `selectedMissionId` | `String` | no | e.g. `"m1"`. |
| `overallScore` | `String` | no | e.g. `"A (92/100)"`. |
| `scores.understanding` | `Number` | no | 0-10. |
| `scores.conceptualClarity` | `Number` | no | 0-10. |
| `scores.execution` | `Number` | no | 0-10. |
| `scores.nepCompliance` | `Number` | no | 0-10. |
| `scores.careerRelevance` | `Number` | no | 0-10. |
| `scores.nepRubricScore` | `Number` | no | 0-100 (used by the NEP card). |
| `highestArea` | `String` | no | |
| `lackedArea` | `String` | no | |
| `feedback` | `String` | no | |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- `{ userId: 1 }`
- `{ userId: 1, createdAt: -1 }`

---

## 6. `quizzes` — Quiz

`backend/src/models/Quiz.ts`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | Indexed. |
| `topic` | `String` | yes | Trimmed. |
| `difficulty` | `Enum` | no | `easy` / `medium` / `hard`. Default `medium`. |
| `questions` | `Array<IQuizQuestion>` | no | See below. |
| `userAnswers` | `Number[]` | no | Indexes into `options`. |
| `score` | `Number` | no | 0-100. |
| `completed` | `Boolean` | no | Default `false`. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**`IQuizQuestion` (subdocument)**

| Field | Type | Notes |
| --- | --- | --- |
| `question` | `String` | |
| `options` | `String[]` | Typically 4 options. |
| `correctAnswer` | `Number` | Index into `options`. |
| `explanation` | `String` | Optional. |

**Indexes**

- `{ userId: 1 }`

---

## 7. `studytopics` — StudyTopic

`backend/src/models/StudyTopic.ts`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | Indexed. |
| `title` | `String` | yes | |
| `description` | `String` | no | |
| `subject` | `String` | no | |
| `level` | `String` | no | |
| `status` | `Enum` | no | `not-started` / `in-progress` / `completed`. Default `not-started`. |
| `progress` | `Number` | no | 0-100. Default `0`. |
| `resources` | `Array<{ title, url?, type }>` | no | `type` is `article` / `video` / `course` / `book`. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- `{ userId: 1 }`

---

## 8. `streaks` — Streak

`backend/src/models/Streak.ts`

Used by `streakService` to track daily engagement and grant grace days.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | auto | |
| `userId` | `ObjectId(User)` | yes | **Unique.** |
| `currentStreak` | `Number` | no | Default `0`. |
| `longestStreak` | `Number` | no | Default `0`. |
| `lastActiveDate` | `Date` | no | Normalized to start-of-day. |
| `graceDaysUsed` | `Number` | no | Default `0`. |
| `graceDaysLimit` | `Number` | no | Default `2`. |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- `{ userId: 1 }` unique

---

## Entity-Relationship Diagram (text)

```
                ┌──────────┐
                │   User   │
                └─────┬────┘
                      │ userId
        ┌─────────────┼─────────────┬──────────────┬──────────────┐
        │             │             │              │              │
        ▼             ▼             ▼              ▼              ▼
    ┌───────┐   ┌──────────┐  ┌──────────┐   ┌──────────┐   ┌────────┐
    │ Task  │   │ Roadmap  │  │ Progress │   │Submission│   │ Quiz   │
    └───────┘   └─────┬────┘  └──────────┘   └──────────┘   └────────┘
                     │ steps[] (embedded)
                     ▼
                (RoadmapStep)

                ┌──────────────┐         ┌──────────────┐
                │ StudyTopic   │         │   Streak     │
                └──────────────┘         └──────────────┘
```

Every domain entity (Task, Roadmap, Progress, Submission, Quiz, StudyTopic,
Streak) is scoped to a single `User` via `userId`. The `Progress` document is
unique per user; the other entities may have many per user.

---

## Migrations

There are no production migrations yet (this is the first release of the new
architecture). All schema changes should be made by editing the Mongoose
models in `backend/src/models/*.ts` and, when shipping a breaking change,
using a one-off script in `backend/src/scripts/`.
