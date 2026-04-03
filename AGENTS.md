# Agent Instructions — TaskFlow Demo

This file is read by Cloud Agents and Background Agents before starting any task.
Follow these instructions strictly.

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

## Required execution order

Do not skip steps.
Do not reorder steps unless a technical issue makes it impossible.

1. Read the task request carefully.
2. Review the relevant files before changing code.
3. Implement the requested change.
4. Run validation commands.
5. Start the app.
6. Perform manual verification with Browser / Computer Use.
7. Capture visual evidence.
8. Open a PR against `main` only after all requirements are satisfied.

## Mandatory: definition of done

A task is only complete when ALL of the following are true:

```bash
npm run lint        # zero ESLint errors
npm run test        # jest unit tests pass
npm run test:e2e    # all Playwright tests pass
```

And all of the following are also true:
- the app was manually verified using Browser / Computer Use
- at least one final screenshot was captured as proof
- the implemented change was specifically checked in the running app
- the PR includes a verification summary and references to the artifacts

If any item above is missing, the task is NOT complete.

## Mandatory: visual verification with Browser / Computer Use

After code changes and after all required tests pass, use Browser / Computer Use
for a final manual verification of the running app at:

- http://localhost:3000

Required visual verification flow:
1. Open the app in the browser.
2. Log in with the demo account:
   - email: demo@example.com
   - password: demo1234
3. Confirm the Kanban board loads successfully.
4. Confirm the Backlog column is visible.
5. Confirm there are no obvious UI breakages.
6. Validate the user flow related to the task you implemented or changed.
7. Take at least one final screenshot showing the app working correctly.
8. If video artifact capture is available in this environment, include a short video of the happy path as well.
9. Include references to the screenshot/video/log artifacts in the PR description.

## Hard rules

- Do not mark the task as complete if Browser / Computer Use was not used.
- Do not mark the task as complete without at least one final screenshot.
- Do not rely only on automated tests as proof that the task works.
- Do not assume the feature works without opening the app.
- Do not open a PR if lint, unit tests, or e2e tests are failing.
- Do not push directly to `main`.
- Do not commit `.env` or `prisma/dev.db`.
- Do not change existing `data-testid` values.
- Do not install new dependencies without justification in the PR.

## Failure handling

If any validation step fails:
1. Investigate the issue.
2. Fix the issue if it is caused by your changes.
3. Re-run the failed command.
4. Re-run manual browser verification if the fix affects user behavior.

If something cannot be completed:
- clearly explain what failed
- include the exact failing command or step
- include the current status in the PR description
- do not pretend the task is complete

## PR format

Title: feat|fix|chore: <short description>

## What changed
...

## Acceptance criteria satisfied
- [x] criterion 1
- [x] criterion 2

## Test output
<paste npm run test:e2e summary>

## Manual verification
- [ ] App opened with Browser / Computer Use
- [ ] Login completed successfully
- [ ] Backlog column confirmed visible
- [ ] Changed flow manually verified

## Visual verification evidence
- [ ] Final screenshot attached or referenced
- [ ] Short note describing what was manually verified
- [ ] Video artifact referenced if available
- [ ] Relevant logs referenced if useful

## Known issues or limitations
- none / <describe clearly>

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

## Agent behavior expectations

Be conservative when deciding that work is complete.
Prefer explicit proof over assumptions.
Prefer showing evidence over claiming success.
A green test suite is necessary but not sufficient.
A successful task must include both automated validation and visual confirmation.
