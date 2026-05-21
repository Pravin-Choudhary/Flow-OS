# Flooist

![Version](https://img.shields.io/badge/version-0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Stage](https://img.shields.io/badge/stage-beta-orange)

Flooist is a team task management app built for small teams who are tired of paying $20/seat for tools that do too much and explain too little. You get workspaces, projects, tasks with priorities and statuses, member roles, and an invite system — nothing more, nothing less. It started as a side project to scratch a real itch and grew into something actually usable. The stack is a React + Vite frontend, an Express + Prisma backend, and PostgreSQL on Neon. No magic, no vendor lock-in.

---

## What it does

Flooist lets you create workspaces and invite your team with a link. Inside each workspace you organize work into projects, and inside each project you create tasks with statuses (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) and priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`). Roles are enforced — an `OWNER` can do everything, an `ADMIN` can manage members and projects, a `MEMBER` can only work on tasks. The permission model isn't bolted on as an afterthought — it's baked into every API endpoint via a role guard that checks permissions before anything touches the database.

![Dashboard preview](./assets/screenshots/dashboard.png)

You can also sign in with Google. The OAuth flow stores a linked account record separately from the user, so the same email can eventually log in via multiple providers without collision.

---

## Getting started

### Prerequisites

- Node.js `>=20.x` (tested on 20 and 22 — haven't tried 18, your mileage may vary)
- `npm` — the project doesn't use workspaces so you can use either npm or pnpm in each directory independently
- A [Neon](https://neon.tech) PostgreSQL database (free tier works fine)
- A Google OAuth client ID and secret if you want Google login — it gracefully degrades if those aren't set

### Clone and install

The repo is a monorepo-style folder with `client/` and `backend/` as independent apps. You need to install both separately.

```bash
git clone https://github.com/Pravin-Choudhary/Flow-OS.git flooist
cd flooist
```

**Backend:**

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

**Client (in a separate terminal):**

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and the backend on `http://localhost:8000`.

### Environment variables

**`backend/.env`** — copy this and fill in your values:

```env
PORT=8000
NODE_ENV=development
BASE_PATH=/api

# Neon PostgreSQL — pooled connection for app, direct for Prisma CLI
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"

# Session
SESSION_SECRET=pick-something-long-and-random
SESSION_EXPIRES_IN=1d

# Google OAuth (optional — comment out to disable Google login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# Frontend
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:5173/google/callback
```

**`client/.env`:**

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Seed the roles

The permission system requires three roles (`OWNER`, `ADMIN`, `MEMBER`) to exist in the database before anything works. Run the seeder once after your first migration:

```bash
cd backend
npx prisma db push
npm run seed
```

### Demo login

You can try it out at the live deployment (link below) using these test credentials:

- **Email:** `demo@flooist.dev`
- **Password:** `flooist2024!`

These are seeded test accounts with a workspace, a few projects, and a bunch of tasks pre-loaded so you can poke around without setting anything up first. Don't put anything sensitive in there.

---

## Project structure

```
flooist/
├── client/                  # Vite + React frontend
│   ├── src/
│   │   ├── components/      # UI primitives (shadcn/ui) and feature components
│   │   ├── context/         # Auth context, React Query provider
│   │   ├── hoc/             # withPermission HOC for role-gated UI
│   │   ├── hooks/           # Custom hooks — API calls live in hooks/api/
│   │   ├── layout/          # App shell layout and base layout wrapper
│   │   ├── lib/             # Axios client, API helpers, utility functions
│   │   ├── page/            # Page components organised by route section
│   │   ├── routes/          # React Router route definitions and guards
│   │   └── types/           # TypeScript types shared across the frontend
│   ├── .env                 # Local env (VITE_API_BASE_URL)
│   └── vite.config.ts       # Vite config
│
├── backend/                 # Express + Prisma API server
│   ├── src/
│   │   ├── config/          # App config, DB connection, Passport setup, HTTP status codes
│   │   ├── controllers/     # Request handlers — thin, just parsing and calling services
│   │   ├── db.ts            # Prisma client singleton with Neon adapter
│   │   ├── enums/           # Shared enums for roles, task status, task priority, providers
│   │   ├── middlewares/     # Auth check, error handler, async wrapper
│   │   ├── routes/          # Express routers, one file per resource
│   │   ├── services/        # All actual business logic lives here
│   │   ├── utils/           # Bcrypt helpers, error classes, env loader, UUID generator
│   │   └── validation/      # Zod schemas for request bodies
│   ├── prisma/
│   │   └── schema.prisma    # Database schema — User, Workspace, Project, Task, Member, Role
│   ├── prisma.config.ts     # Prisma v7 config file (schema path + datasource URL)
│   └── package.json
│
└── README.md
```

---

## How it works

### Authentication

Auth is session-based using `cookie-session` and Passport.js. When a user logs in (email/password or Google OAuth), Passport validates the credentials, serializes the user object into the session cookie, and from that point on every request reads the session off the cookie. In production, the cookie is set with `sameSite: "none"` and `secure: true` so it crosses the Vercel → Render domain boundary correctly.

Google OAuth goes through a standard redirect flow — the user hits `/api/auth/google`, gets sent to Google's consent screen, and Google redirects back to `/api/auth/google/callback`. At that point Passport either links the Google account to an existing user (matched by email) or creates a new user and a default workspace for them.

### Workspaces and membership

Every user gets a personal workspace created automatically on sign-up. To add team members, the workspace owner shares an invite link generated from a unique code. When someone visits the invite URL and accepts, a `Member` record is created with a default `MEMBER` role. Roles can be changed later by anyone with `CHANGE_MEMBER_ROLE` permission (admins and owners).

```
User signs up
  └─> Workspace created (ownerId = user.id)
  └─> Member record created (role = OWNER)
  └─> user.currentWorkspaceId set to new workspace
```

### Tasks and permissions

Tasks belong to a project, which belongs to a workspace. Every write operation (create, edit, delete) first checks whether the calling user has the required permission for their role in that workspace. This check happens in a `roleGuard` utility that's called at the top of each service function — before any database write. If the check fails, it throws a `403` and nothing gets written.

The task model tracks status (`BACKLOG` → `TODO` → `IN_PROGRESS` → `IN_REVIEW` → `DONE`) and priority (`LOW` / `MEDIUM` / `HIGH` / `URGENT`). Each task also has a `taskCode` (e.g. `PROJ-42`) that's unique across the workspace, generated at creation time.

### Data flow (simplified)

```
Client (Vite/React)
  │
  │  axios + withCredentials: true
  ▼
Express API (Render)
  │
  ├── Passport.js (session auth)
  ├── Zod validation (request body)
  ├── Role guard (permission check)
  │
  ▼
Prisma Client → Neon PostgreSQL (via @prisma/adapter-neon)
```

The frontend uses React Query for all server state. Each resource (workspaces, projects, tasks, members) has its own hook in `hooks/api/` that wraps an Axios call and handles loading/error states. Nothing exotic — just fetch, cache, invalidate on mutation.

---

## Contributing

Pull requests are genuinely welcome. The codebase is clean enough to navigate without a guide, but here's what's actually useful to know before you start.

**Things that would help most right now:** more robust error handling on the frontend (the error boundary situation is embarrassing), tests for the service layer, and better loading states in the task table when filters change.

**Things that aren't open for PRs yet:** the invite system is getting a rewrite to support expiring invite links and per-invite role assignment — hold off on touching `member.service.ts` until that's sorted.

To get a PR merged, it needs to build cleanly (`npm run build` in `backend/`) and not break the existing API contract. There are no automated tests yet (I know, I know) so at minimum describe what you tested manually.

```bash
# Type-check the backend
cd backend && npm run build

# Lint the frontend
cd client && npm run lint
```

If you're adding a new feature that touches permissions, make sure it goes through the `roleGuard` in `src/utils/roleGuard.ts` — don't do your own ad-hoc checks inline.

---

## Known issues / Roadmap

- **Session persistence on Render free tier:** Render spins down idle services. When it wakes back up, in-memory session data is gone, so users get logged out unexpectedly. The fix is moving to a Redis-backed session store or switching to JWTs — that's coming, just not done yet.

- **No email verification:** Users can register with any email address. There's no confirmation step. This is intentional for now (MVP friction) but will need to change before this can be used in any real production setting.

- **Invite links don't expire:** Once you generate an invite code it's valid forever. There's no mechanism to rotate or revoke it short of deleting the workspace. This needs fixing before the invite system is actually safe.

- **Task filtering resets on navigation:** If you filter the task table by assignee or status and then navigate away and back, the filters are gone. URL-based filter state (`nuqs`) is wired up but not fully plumbed through yet.

- **Google OAuth requires manual Passport configuration:** If `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` aren't set, the Google strategy is skipped but the passport middleware still loads. If someone hits `/api/auth/google` in that state, it throws a 500 instead of a clear "not configured" message. It's on the list.

---

## License

MIT. Do what you want with it, just don't remove the license header.

---

## Acknowledgments

The heavy lifting is done by a small number of libraries that genuinely made this possible: [Prisma](https://www.prisma.io/) for the ORM and schema workflow, [Neon](https://neon.tech) for serverless Postgres that actually works on a free tier, [shadcn/ui](https://ui.shadcn.com/) for the component primitives, [TanStack Query](https://tanstack.com/query) for server state, and [Passport.js](https://www.passportjs.org/) for auth strategies that don't require reinventing the wheel.
