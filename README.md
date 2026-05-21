# Flow-OS

A project management tool with workspaces, role-based access, and task tracking — built as a take-home assessment.

![Assessment Submission](https://img.shields.io/badge/type-assessment%20submission-blueviolet) ![React](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite-61DAFB) ![Express](https://img.shields.io/badge/backend-Express%20%2B%20TypeScript-green) ![PostgreSQL](https://img.shields.io/badge/db-PostgreSQL%20%28Neon%29-336791) ![Prisma](https://img.shields.io/badge/ORM-Prisma%207-2D3748)

---

## Overview

The task was to build a project management application where users can organize work across multiple teams. I interpreted this as needing: multi-tenant workspaces, projects inside those workspaces, tasks with status/priority tracking, and a member system with enforced permissions. Rather than building a wide feature set shallowly, I focused on getting the core data model and permission system right — a workspace that works correctly across owners, admins, and members tells you more about architectural thinking than a wider but thinner feature list. Authentication covers both email/password and Google OAuth. The app is deployed — backend on Render, frontend on Vercel — so you can evaluate it running live without any local setup.

---

## What's included

The app covers the full cycle of creating and working in a team workspace.

- **Authentication** — email/password login and registration, Google OAuth via Passport.js, session-based auth using `cookie-session`
- **Workspaces** — create a workspace, invite members via a unique link, switch between multiple workspaces
- **Role-based access** — three roles: `OWNER`, `ADMIN`, `MEMBER`, each with a defined set of permissions enforced at the API layer
- **Projects** — create projects inside a workspace with a name, optional description, and an emoji picker
- **Tasks** — full CRUD on tasks with status (`BACKLOG` / `TODO` / `IN_PROGRESS` / `IN_REVIEW` / `DONE`), priority (`LOW` / `MEDIUM` / `HIGH` / `URGENT`), assignee, due date, and an auto-generated task code (e.g. `PROJ-14`)
- **Task table** — filterable, sortable table view with column-level controls for status and priority
- **Workspace analytics** — counts of total tasks, completed tasks, and overdue tasks at both workspace and project level
- **Member management** — invite by link, view members, change roles (admin and owner only)
- **Protected routes** — unauthenticated users are redirected to login; certain UI actions are hidden or disabled based on the user's role in the current workspace

![Login screen](./assets/login.png)

![Dashboard view](./assets/dashboard.png)

![Task table](./assets/tasks.png)

![Project create/update modal](./assets/project.png)

---

## Getting started

Requires Node `>=20`. Both directories (`client/` and `backend/`) are independent — install and run them separately.

```bash
git clone https://github.com/Pravin-Choudhary/Flow-OS.git
cd Flow-OS
```

**Backend:**

```bash
cd backend
npm install
npx prisma db push    # applies the schema to your database
npm run seed          # seeds the three required roles (OWNER, ADMIN, MEMBER)
npm run dev
```

**Client (in a separate terminal):**

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173`, the backend on `http://localhost:8000`.

### Environment variables

**`backend/.env`:**

```env
PORT=8000
NODE_ENV=development
BASE_PATH=/api

# Neon PostgreSQL (or any PostgreSQL instance)
# Pooled connection for the app runtime:
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
# Direct connection for Prisma CLI migrations:
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Session
SESSION_SECRET=any-long-random-string-here
SESSION_EXPIRES_IN=1d

# Google OAuth — comment out both to disable Google login gracefully
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# Frontend origin (for CORS)
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/google/callback
```

**`client/.env`:**

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Try it now

The live deployment has a demo account pre-seeded with sample data.

```
Email:    demo@flow-os.dev
Password: FlowOS#2024
```

These credentials are pre-seeded in the database with sample data. No setup needed beyond the steps above.

**Live URL:** `https://flow-os-ten-ochre.vercel.app`

---

## How it's organized

```
Flow-OS/
├── client/                  # Vite + React 18 frontend
│   ├── src/
│   │   ├── components/      # UI primitives (shadcn/ui) and feature components
│   │   ├── context/         # Auth context and React Query provider
│   │   ├── hoc/             # withPermission HOC — role-gated UI wrapper
│   │   ├── hooks/           # Custom hooks; API calls live in hooks/api/
│   │   ├── layout/          # App shell and base layout wrapper
│   │   ├── lib/             # Axios client, API helpers, utils
│   │   ├── page/            # Page components grouped by route section
│   │   ├── routes/          # React Router definitions and auth guards
│   │   └── types/           # TypeScript types shared across the app
│   └── vite.config.ts
│
├── backend/                 # Express + TypeScript API
│   ├── src/
│   │   ├── config/          # App config, DB connection, Passport, HTTP codes
│   │   ├── controllers/     # Request parsing — thin, delegates to services
│   │   ├── db.ts            # Prisma client singleton with Neon adapter
│   │   ├── enums/           # Role, task status, task priority, provider enums
│   │   ├── middlewares/     # isAuthenticated, errorHandler, asyncHandler
│   │   ├── routes/          # Express routers — one file per resource
│   │   ├── services/        # Business logic — all writes go through here
│   │   ├── utils/           # Error classes, bcrypt helpers, env loader, UUID
│   │   └── validation/      # Zod schemas for all incoming request bodies
│   ├── prisma/
│   │   └── schema.prisma    # Data model — User, Workspace, Project, Task, Member, Role
│   └── prisma.config.ts     # Prisma v7 config (schema path + datasource)
│
└── README.md
```

---

## A few decisions worth noting

**Session-based auth instead of JWTs.** I chose `cookie-session` with Passport.js over a JWT approach because it's simpler to reason about for server-rendered role checks — there's no token refresh logic, no client-side token storage problem, and revocation is straightforward. The trade-off is that it doesn't work well horizontally without sticky sessions or a shared session store. For a single-instance deployment (which this is), it's fine.

**Prisma v7 with the Neon serverless adapter.** Neon's connection pooling is built for serverless environments and the `@prisma/adapter-neon` driver lets Prisma speak directly to it over WebSockets instead of standard TCP. This saved me from dealing with connection limit issues on the free tier. The version mismatch between Prisma CLI (6.x) and the client (7.x) caused build failures when deploying — I'd document that pairing issue more clearly if I were starting again, and I'd pin both to the same version from the start.

**Role checks in the service layer, not middleware.** Permission enforcement lives inside each service function via a `roleGuard` utility rather than in route middleware. This was a deliberate choice — it keeps the business rule close to the operation it protects, and it's harder to accidentally bypass when adding new routes. The downside is some repetition across service files. Middleware-level guards would be cleaner for route-wide patterns, but they make it easier to ship a route that forgets to add the guard.

**Typed error classes instead of generic Error throws.** I built a small hierarchy (`AppError` → `NotFoundException`, `BadRequestException`, `UnauthorizedException`) that carries an HTTP status code and a typed error code enum. The central `errorHandler` middleware reads those and formats the response consistently. This made client-side error handling much simpler — the frontend can check `error.errorCode` for specific cases rather than parsing messages.

**No monorepo tooling.** `client/` and `backend/` are two independent npm projects. I considered using Turborepo or pnpm workspaces but decided against adding that complexity for a two-package project. It means two separate `npm install` steps, but nothing else is affected.

**`sameSite: "none"` for cross-origin session cookies.** The frontend and backend are deployed on different domains (Vercel and Render). Session cookies need `sameSite: "none"` + `secure: true` in production to cross that domain boundary. In development they use `sameSite: "lax"` which is safe on localhost. I also had to add `app.set("trust proxy", 1)` so Express correctly reads the `X-Forwarded-Proto` header from Render's proxy — without it, the cookies are marked insecure even over HTTPS and the browser refuses to send them.

---

## If I had more time

- **Email verification is missing.** Users can register with any email address and are immediately active. Server-side I'd add a `verifiedAt` field on the `User` model and a verification token flow before allowing login.

- **Invite links don't expire.** The current `inviteCode` on a workspace is permanent. There's no rotation, no per-invite role selection, and no way to revoke access without deleting the workspace. This would need a separate `Invitation` model with an `expiresAt` and a `usedAt` timestamp.

- **The task filter state resets on navigation.** `nuqs` (URL-based query state) is installed and partially wired, but filter state isn't fully persisted in the URL. If you filter by status and navigate to a task then back, the filter is gone.

- **No server-side pagination.** The task list fetches all tasks in a workspace and paginates on the client. This is fine at small scale but would need a proper `skip`/`take` API with total count before this could handle real data volumes.

- **No tests.** I made a conscious call to skip testing given the time available and focus on getting the core features working correctly. If I were extending this, I'd start with integration tests on the service layer — specifically the permission checks and the transaction-wrapped operations like workspace creation and deletion.

---

## Tests

There are no automated tests in the current submission. Given the time constraints, I prioritized building a complete working feature set over test coverage. If I were to add tests, I'd start with the service layer — specifically `workspace.service.ts` and the role guard utility, since those contain the most consequential logic (permission enforcement, transaction correctness). The controllers are thin enough that service-level tests would cover most meaningful behavior. On the frontend, I'd test the `withPermission` HOC and the auth context since those affect what UI is shown to which users.

---

## License

MIT

Built as part of a take-home assessment for the assessment team. Not intended for production use.
