# Cloud Agent Demo Tasks

Eight concrete tasks designed to be delegated to a Cloud Agent in Cursor.
Each task has a clear description, step-by-step guidance, and **verifiable acceptance criteria**.

---

## Task 1 — Show task counter per column

**Difficulty:** Easy
**Estimated scope:** 1–2 files

### Description
Each column header should display a badge showing how many tasks are currently visible in that column. The counter must update in real time as tasks are created, deleted, or filtered.

### Steps
1. In `src/components/TaskColumn.tsx`, find the column header section.
2. The `tasks` prop already contains the filtered list — use `tasks.length`.
3. Render a `<span>` badge next to the column label with the count.
4. Style it consistently with the existing column color scheme.

### Acceptance criteria
- [ ] Each column header shows `"Label (N)"` or a numeric badge.
- [ ] Adding a task increments the counter in that column immediately.
- [ ] Deleting a task decrements the counter immediately.
- [ ] Filtering by status (e.g. "Done") sets non-matching columns to 0.
- [ ] `npm run test:e2e` passes without errors.

---

## Task 2 — Filter by priority

**Difficulty:** Easy–Medium
**Estimated scope:** 2–3 files

### Description
Add a second filter row (or extend the existing filter bar) that allows filtering tasks by priority: ALL / LOW / MEDIUM / HIGH.

### Steps
1. Add a `priorityFilter` state (`'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'`) to `KanbanBoard.tsx`.
2. Extend the `visibleTasks` memo to also check priority.
3. Render priority filter buttons with `data-testid="priority-filter-low"` etc.
4. Write a Playwright test: select "High", assert only HIGH-priority cards are visible.

### Acceptance criteria
- [ ] Priority filter buttons render in the toolbar.
- [ ] Selecting "High" hides LOW and MEDIUM tasks across all columns.
- [ ] "All" resets priority filtering.
- [ ] Priority and status filters compose (both active simultaneously).
- [ ] New Playwright test in `tests/e2e/board.spec.ts` passes.

---

## Task 3 — Delete confirmation dialog

**Difficulty:** Medium
**Estimated scope:** 2–3 files

### Description
Replace the immediate delete with a confirmation modal that asks the user to confirm before permanently removing a task.

### Steps
1. Create a `ConfirmModal` component (or reuse `TaskModal` pattern) with a message and two buttons.
2. In `KanbanBoard.tsx`, intercept the `handleDelete` flow: show `ConfirmModal`, only call the API on confirm.
3. Add `data-testid="confirm-delete-modal"` and `data-testid="confirm-delete-button"`.
4. Write a Playwright test: click delete, assert modal appears, click cancel, assert task still exists.

### Acceptance criteria
- [ ] Clicking the trash icon opens a confirmation modal.
- [ ] Clicking "Cancel" closes the modal and does NOT delete the task.
- [ ] Clicking "Delete" closes the modal and removes the task.
- [ ] `data-testid="confirm-delete-modal"` is present on the modal.
- [ ] Two new Playwright test cases (cancel flow + confirm flow) pass.

---

## Task 4 — Fix mobile layout overflow bug

**Difficulty:** Medium
**Estimated scope:** 1–2 files

### Description
On viewports narrower than 640 px, the four kanban columns overflow `<body>` horizontally without a proper scroll container, causing the page layout to break.

### Steps
1. In `src/components/KanbanBoard.tsx`, find the columns wrapper div.
2. Ensure it has `overflow-x-auto` and the inner flex container uses `min-w-max` or similar.
3. Add `-webkit-overflow-scrolling: touch` for smooth iOS scroll.
4. Test at 375 px viewport width.

### Acceptance criteria
- [ ] At 375 px viewport width, `document.body.scrollWidth === window.innerWidth` (no horizontal body overflow).
- [ ] Columns are horizontally scrollable within their container.
- [ ] At 1400 px viewport the layout is unchanged.
- [ ] A Playwright test asserts no overflow at mobile viewport.

---

## Task 5 — Dark mode toggle

**Difficulty:** Medium
**Estimated scope:** 3–4 files

### Description
Add a dark/light mode switch in the header. Persist the preference in `localStorage`. Use Tailwind's `darkMode: 'class'` strategy.

### Steps
1. In `tailwind.config.js`, set `darkMode: 'class'`.
2. Add dark variants to key components (`bg-white` → `dark:bg-gray-900`, etc.).
3. In `Header.tsx`, add a sun/moon toggle button (`data-testid="dark-mode-toggle"`).
4. On mount, read `localStorage.getItem('theme')` and apply/remove `dark` class on `<html>`.
5. On toggle, flip the class and persist to localStorage.

### Acceptance criteria
- [ ] Clicking the toggle adds `class="dark"` to `<html>` and switches the color scheme visually.
- [ ] Clicking again removes `class="dark"` and restores light mode.
- [ ] Preference survives a full page reload.
- [ ] `data-testid="dark-mode-toggle"` is present.
- [ ] A Playwright test toggles dark mode and asserts the `dark` class on `<html>`.

---

## Task 6 — Improve accessibility (a11y)

**Difficulty:** Medium–Hard
**Estimated scope:** 4–6 files

### Description
Audit and fix accessibility issues across the app: ARIA labels, keyboard navigation, focus management, and Escape-key support in modals.

### Steps
1. Install `@axe-core/playwright`: `npm install -D @axe-core/playwright`.
2. Add `aria-label` to all icon-only buttons (edit, delete, close modal, logout).
3. Ensure every `<input>` and `<select>` has an associated `<label>` (already done in modal — verify).
4. In `TaskModal.tsx`, add a `useEffect` that listens for `keydown` `Escape` and calls `onClose`.
5. When modal opens, `focus()` the title input automatically.
6. Write an axe test in `tests/e2e/board.spec.ts`.

### Acceptance criteria
- [ ] `axe-playwright` reports 0 critical or serious violations on `/login` and `/board`.
- [ ] All icon-only buttons have `aria-label` attributes.
- [ ] Modal closes when `Escape` is pressed.
- [ ] Focus moves to the title input when modal opens.
- [ ] Playwright a11y test passes.

---

## Task 7 — Drag and drop between columns

**Difficulty:** Hard
**Estimated scope:** 4–6 files + new dependency

### Description
Allow users to drag task cards between kanban columns. The task's status must be updated in the database on drop.

### Steps
1. Install `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`.
2. Wrap `KanbanBoard` with `<DndContext>`.
3. Make each `TaskColumn` a droppable zone using `useDroppable`.
4. Make each `TaskCard` draggable using `useDraggable`.
5. On `onDragEnd`, if the card moved to a different column, call `PUT /api/tasks/:id` with the new status and update local state.
6. Add `data-testid="drag-handle-{taskId}"` to the drag handle.
7. Write a Playwright test using `page.dragAndDrop`.

### Acceptance criteria
- [ ] Cards can be dragged between columns visually.
- [ ] After dropping, the task status is updated in the DB (verify by refreshing the page).
- [ ] Dropping in the same column does nothing.
- [ ] A Playwright test drags a card from TODO to DONE and asserts it appears in DONE after a page reload.
- [ ] `npm run test:e2e` passes.

---

## Task 8 — GitHub Actions CI pipeline

**Difficulty:** Medium
**Estimated scope:** 1 new file

### Description
Create a CI workflow that runs lint, unit tests, and Playwright E2E tests on every push and pull request to `main`.

### Steps
1. Create `.github/workflows/ci.yml`.
2. Trigger on `push` and `pull_request` to `main`.
3. Set up Node 20, run `npm ci`, copy `.env.example` to `.env`.
4. Run `npx prisma migrate deploy && npm run db:seed`.
5. Run `npm run lint`, `npm run test`, and `npm run test:e2e` (headless).
6. Upload Playwright report as an artifact on failure.

### Acceptance criteria
- [ ] `.github/workflows/ci.yml` is valid YAML (`yamllint` passes).
- [ ] The workflow has three jobs or steps: lint, test, test:e2e.
- [ ] Playwright runs in headless Chromium.
- [ ] The Playwright HTML report is uploaded as a GitHub Actions artifact on failure.
- [ ] On a clean repository checkout, all steps pass (simulate with `act` or push to a fork).
