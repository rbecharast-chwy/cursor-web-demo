# Cloud Agent Demo Tasks

Eight tasks to delegate to a Cloud Agent. Each one describes **what the app should do** and how to verify it — not how to implement it.

---

## Task 1 — Task counter per column

Each column header currently shows only the column name. Users need to know at a glance how many tasks are in each column, and that number should stay accurate as tasks are added, removed, or filtered.

### Acceptance criteria
- [ ] Every column header displays the current task count.
- [ ] The count updates immediately when a task is created or deleted.
- [ ] When a status filter is active, the count reflects only the visible tasks.
- [ ] `npm run test:e2e` passes.

---

## Task 2 — Filter by priority

The filter bar lets users filter by status. It should also let them filter by priority so they can focus on what matters most.

### Acceptance criteria
- [ ] The toolbar has priority filter options: All / Low / Medium / High.
- [ ] Selecting a priority hides tasks with a different priority across all columns.
- [ ] Priority and status filters work together simultaneously.
- [ ] New filter buttons have `data-testid` attributes.
- [ ] A new Playwright test covers the priority filter flow and passes.

---

## Task 3 — Delete confirmation

Deleting a task is irreversible and currently happens with a single click. Users need a confirmation step before a task is permanently removed.

### Acceptance criteria
- [ ] Clicking the delete button opens a confirmation dialog, not an immediate delete.
- [ ] The dialog has a cancel option that closes it without deleting anything.
- [ ] Confirming removes the task from the board and the database.
- [ ] Two Playwright tests cover both paths (cancel and confirm) and pass.

---

## Task 4 — Mobile layout overflow

On narrow screens (375 px wide) the kanban board breaks the page layout — content overflows the viewport horizontally. The board should be usable on mobile without breaking the page.

### Acceptance criteria
- [ ] At 375 px viewport width there is no horizontal overflow on `<body>`.
- [ ] The columns are scrollable horizontally within their container.
- [ ] The desktop layout (1400 px) is unchanged.
- [ ] A Playwright test run at 375 px viewport confirms no overflow.

---

## Task 5 — Dark mode

Users want to switch between light and dark color schemes. The preference should persist across sessions.

### Acceptance criteria
- [ ] A toggle button in the header switches between light and dark mode.
- [ ] The dark theme is applied consistently across the board, header, cards, and modals.
- [ ] The selected theme is saved and restored on page reload.
- [ ] The toggle button has `data-testid="dark-mode-toggle"`.
- [ ] A Playwright test verifies the theme persists after reload.

---

## Task 6 — Accessibility audit and fixes

The app has not been audited for accessibility. It should be usable by people relying on keyboards, screen readers, or other assistive technologies.

### Acceptance criteria
- [ ] `axe-core` reports zero critical or serious violations on `/login` and `/board`.
- [ ] All icon-only buttons are operable and identifiable without a mouse.
- [ ] The task modal can be closed with the keyboard.
- [ ] Focus is managed correctly when the modal opens and closes.
- [ ] A Playwright test using `axe-core` is added and passes.

---

## Task 7 — Drag and drop between columns

Moving a task between columns currently requires opening the edit modal and changing the status from a dropdown. Users should be able to drag a card directly from one column to another.

### Acceptance criteria
- [ ] Cards can be dragged from any column and dropped into any other column.
- [ ] The task's status is updated in the database after a successful drop.
- [ ] Dropping a card on its own column does nothing.
- [ ] After a page reload the card appears in the column it was dropped into.
- [ ] A Playwright test drags a card between two columns and verifies the result after reload.

---

## Task 8 — CI pipeline

There is no automated quality gate on pull requests. Every PR to `main` should be validated automatically before merging.

### Acceptance criteria
- [ ] A GitHub Actions workflow runs on every push and pull request to `main`.
- [ ] The workflow runs lint, unit tests, and Playwright E2E tests.
- [ ] The workflow fails the PR if any of those steps fail.
- [ ] The Playwright HTML report is uploaded as an artifact when tests fail.
- [ ] The workflow passes on a clean checkout of the repository.
