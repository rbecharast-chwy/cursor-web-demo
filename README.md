# TaskFlow — Cloud Agent Demo

A production-style Kanban task management app built to showcase **Cloud Agents** and **computer use** capabilities in Cursor. The app is intentionally simple, visually clear, and fully self-contained — no external services required.

---

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Framework   | Next.js 14 (App Router, TypeScript)  |
| Styling     | Tailwind CSS                         |
| Database    | Prisma ORM + SQLite                  |
| Tests       | Playwright (E2E)                     |
| Icons       | Lucide React                         |
| Linting     | ESLint (eslint-config-next)          |

---

## Prerequisites

- **Node.js** 18.17+ (recommend 20 LTS)
- **npm** 9+ or **pnpm** 8+

No Docker, no cloud accounts, no API keys needed.

---

## Installation

```bash
# 1. Clone / enter the project
cd cursor-web-demo

# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env

# 4. Create DB and run migrations
npx prisma migrate dev --name init

# 5. Seed demo data
npm run db:seed
```

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo credentials:**
- Email: `demo@example.com`
- Password: `demo1234`

The app always runs on **port 3000**.

---

## Available Scripts

| Script            | Description                                      |
|-------------------|--------------------------------------------------|
| `npm run dev`     | Start Next.js development server (port 3000)     |
| `npm run build`   | Build for production                             |
| `npm run start`   | Start production server                          |
| `npm run lint`    | Run ESLint                                       |
| `npm run test`    | Run unit tests (Jest)                            |
| `npm run test:e2e`| Run Playwright end-to-end tests                  |
| `npm run test:e2e:ui` | Open Playwright UI mode                      |
| `npm run db:seed` | Seed the database with demo data                 |
| `npm run db:reset`| Reset DB + re-seed                               |

---

## Environment Variables

See `.env.example`. For local development the defaults work out of the box:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="change-me-in-production-32-chars-min"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Project Structure

```
cursor-web-demo/
├── docs/
│   └── demo-tasks.md          # 8 concrete tasks for cloud agents
├── prisma/
│   ├── schema.prisma           # User + Task models (SQLite)
│   └── seed.ts                 # Demo data (15 tasks, 1 user)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/     # POST — authenticate
│   │   │   ├── auth/logout/    # POST — clear session
│   │   │   └── tasks/          # CRUD for tasks
│   │   ├── board/page.tsx      # Kanban board (protected)
│   │   ├── login/page.tsx      # Login page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── KanbanBoard.tsx     # Main board (client, state)
│   │   ├── TaskColumn.tsx      # Column with task list
│   │   ├── TaskCard.tsx        # Individual task card
│   │   ├── TaskModal.tsx       # Create / edit modal
│   │   └── Header.tsx          # Top nav + logout
│   ├── lib/
│   │   ├── prisma.ts           # Prisma singleton
│   │   └── auth.ts             # Auth helpers
│   ├── middleware.ts            # Route protection
│   └── types/index.ts          # Shared TypeScript types
├── tests/
│   └── e2e/
│       ├── helpers.ts           # Login helper
│       ├── login.spec.ts        # Auth flows
│       ├── tasks.spec.ts        # CRUD flows
│       └── board.spec.ts        # Search + filter
├── playwright.config.ts
├── .env.example
└── README.md
```

---

## API Reference

All endpoints require an active session cookie (`session`).

| Method | Path                  | Description               |
|--------|-----------------------|---------------------------|
| POST   | `/api/auth/login`     | Authenticate user         |
| POST   | `/api/auth/logout`    | Clear session             |
| GET    | `/api/tasks`          | List tasks (filter/search)|
| POST   | `/api/tasks`          | Create task               |
| GET    | `/api/tasks/:id`      | Get single task           |
| PUT    | `/api/tasks/:id`      | Update task               |
| DELETE | `/api/tasks/:id`      | Delete task               |

Query params for `GET /api/tasks`: `?status=TODO&search=keyword`

---

## Running Tests

```bash
# E2E (requires dev server running or auto-started by Playwright)
npm run test:e2e

# With Playwright UI (great for debugging)
npm run test:e2e:ui

# Unit tests
npm run test
```

Playwright auto-starts the dev server if it is not already running.

---

## Suggested Cloud Agent Tasks

These tasks are designed to be delegated to a **Cloud Agent** (e.g. in Cursor). Each is self-contained, testable, and progressively more complex. They mirror the **Backlog** column already seeded in the app.

### 1. Add task counter per column _(easy)_
Display the count of tasks next to each column header. The count should update in real time as tasks are moved or created.
**Verify:** Column headers show "(N)" badge; count changes after adding/deleting a task.

### 2. Add filter by priority _(easy–medium)_
Extend the filter bar to allow filtering by LOW / MEDIUM / HIGH priority (in addition to the existing status filter).
**Verify:** Selecting "High" hides all non-HIGH tasks across all columns.

### 3. Add delete confirmation dialog _(medium)_
Before deleting a task, show a confirmation modal. The modal should have "Cancel" and "Delete" buttons and a `data-testid="confirm-delete-button"`.
**Verify:** Clicking delete without confirming does nothing; confirming removes the card; Playwright test passes.

### 4. Fix mobile layout bug _(medium)_
On screens narrower than 640 px the columns overflow without a scroll container. Wrap the board in a horizontally scrollable container with proper touch scroll behaviour.
**Verify:** At 375 px viewport width the page renders without horizontal overflow on `<body>`.

### 5. Add dark mode toggle _(medium)_
Add a sun/moon button in the header that switches between light and dark theme. Persist the preference in `localStorage`. Wire Tailwind's `darkMode: 'class'` strategy.
**Verify:** Toggling the button adds/removes `class="dark"` on `<html>`; preference survives a page reload.

### 6. Improve accessibility _(medium–hard)_
Add `aria-label` attributes to all icon-only buttons, ensure every form field has an associated `<label>`, and make the modal closeable with the `Escape` key. Run `axe-playwright` and fix all critical violations.
**Verify:** `axe-playwright` reports 0 critical or serious violations on `/board`.

### 7. Add drag and drop _(hard)_
Install `@dnd-kit/core` and `@dnd-kit/sortable`. Allow dragging task cards between columns. Update the task status via `PUT /api/tasks/:id` on drop.
**Verify:** Dragging a card from TODO to DONE updates its status in the DB; a Playwright test drags a card and asserts it appears in the target column.

### 8. Set up CI pipeline _(medium)_
Create `.github/workflows/ci.yml` that runs `npm run lint`, `npm run test`, and `npm run test:e2e` (headless) on every push and PR to `main`.
**Verify:** The workflow file is valid YAML; all three jobs pass on a clean checkout in a GitHub Actions runner.

---

## Notes for Computer Use Agents

This app was designed to be easy for browser-based agents to navigate:

- **Stable port:** always `http://localhost:3000`
- **Pre-filled credentials:** the login form is pre-filled with `demo@example.com` / `demo1234` — just click **Sign in**
- **`data-testid` attributes:** every interactive element has a `data-testid` for reliable selection without relying on text or CSS selectors
- **Visible backlog:** the leftmost column of the board shows 7 pre-seeded agent tasks ready to be picked up
- **REST API:** agents can also interact programmatically via `/api/tasks` (curl/fetch) without using the browser
- **Reset:** run `npm run db:reset` to restore the app to its initial seeded state between agent sessions

### Recommended agent workflow

```
1. npm run dev          # Start the app
2. Open http://localhost:3000
3. Click "Sign in" (credentials pre-filled)
4. Pick a task from the Backlog column
5. Implement the feature / fix
6. npm run test:e2e     # Validate with Playwright
7. npm run lint         # Check for lint errors
8. (Optional) Open a PR for review
```
