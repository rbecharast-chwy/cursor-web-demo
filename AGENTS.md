# Agent Instructions — TaskFlow Demo

This file is read by Cloud Agents and Background Agents before starting any task.

## Project overview

A Kanban task management app built with Next.js 14, Tailwind CSS, Prisma + SQLite, and Playwright.
Its purpose is to demonstrate Cloud Agent capabilities in Cursor.

- **App URL:** http://localhost:3000
- **Login:** demo@example.com / demo1234
- **Tasks backlog:** visible in the leftmost column of the board (Backlog)
- **Detailed task specs:** `docs/demo-tasks.md`

## Setup (run once)

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run db:seed
```

## Start the app

```bash
npm run dev   # starts on port 3000
```

## Mandatory: definition of done

A task is only complete when ALL of the following pass:

```bash
npm run lint        # zero ESLint errors
npm run test        # jest unit tests pass
npm run test:e2e    # all Playwright tests pass
```

Then open a pull request against `main`.

## PR format

```
Title: feat|fix|chore: <short description>

## What changed
...

## Acceptance criteria satisfied
- [x] criterion 1
- [x] criterion 2

## Test output
<paste npm run test:e2e summary>
```

## Key files

| File | Purpose |
|------|---------|
| `docs/demo-tasks.md` | Full task specs with acceptance criteria |
| `src/components/KanbanBoard.tsx` | Main board state and logic |
| `src/components/TaskColumn.tsx` | Single column component |
| `src/components/TaskCard.tsx` | Task card component |
| `src/components/TaskModal.tsx` | Create/edit modal |
| `src/app/api/tasks/route.ts` | Tasks list + create API |
| `src/app/api/tasks/[id]/route.ts` | Task update + delete API |
| `prisma/seed.ts` | Demo data (reset with `npm run db:reset`) |
| `tests/e2e/` | Playwright test suite |

## Constraints

- Do not push directly to `main` — use a PR
- Do not commit `.env` or `prisma/dev.db`
- Do not change existing `data-testid` values
- Do not install new dependencies without justification

## Cursor Cloud specific instructions

- The update script runs `npm install`, copies `.env.example` to `.env` (if `.env` is missing), runs Prisma migrations, seeds the database, and installs Playwright's Chromium browser. No manual setup is needed after the script completes.
- The `db:seed` script requires `DATABASE_URL` to be set. The `.env` file provides it, but if running seed outside the Next.js context, pass it explicitly: `DATABASE_URL="file:./dev.db" npm run db:seed`.
- Playwright E2E tests (`npm run test:e2e`) auto-start the dev server if it is not already running, so you do not need to start `npm run dev` beforehand for testing.
- To reset the database to a clean seeded state between sessions: `npm run db:reset`.
- Xvfb, Google Chrome, and Playwright system dependencies are pre-installed in the Cloud Agent VM. No additional system package installation is needed for headless browser testing or computer use.
- All standard commands (`npm run dev`, `npm run lint`, `npm run test`, `npm run test:e2e`) are documented in the README and `package.json` scripts section.
