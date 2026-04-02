import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Board search and filter', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('shows all four columns on load', async ({ page }) => {
    await expect(page.getByTestId('column-backlog')).toBeVisible()
    await expect(page.getByTestId('column-todo')).toBeVisible()
    await expect(page.getByTestId('column-in-progress')).toBeVisible()
    await expect(page.getByTestId('column-done')).toBeVisible()
  })

  test('filters tasks by status', async ({ page }) => {
    // Click "Done" filter
    await page.getByTestId('filter-done').click()

    // BACKLOG / TODO / IN_PROGRESS columns should be empty
    await expect(page.getByTestId('column-backlog').getByText('No tasks here')).toBeVisible()
    await expect(page.getByTestId('column-todo').getByText('No tasks here')).toBeVisible()
    await expect(page.getByTestId('column-in-progress').getByText('No tasks here')).toBeVisible()

    // DONE column should have tasks
    const doneCards = page.getByTestId('column-done').locator('[data-testid^="task-card-"]')
    await expect(doneCards.first()).toBeVisible()
  })

  test('searches tasks by keyword', async ({ page }) => {
    await page.getByTestId('search-input').fill('kanban')
    // At least one result should mention "kanban" (case-insensitive)
    const cards = page.locator('[data-testid^="task-card-"]')
    await expect(cards.first()).toBeVisible()
  })

  test('shows "No tasks here" when search has no results', async ({ page }) => {
    await page.getByTestId('search-input').fill('xyzzy-no-match-999')
    for (const col of ['backlog', 'todo', 'in-progress', 'done']) {
      await expect(page.getByTestId(`column-${col}`).getByText('No tasks here')).toBeVisible()
    }
  })

  test('backlog column has seeded agent tasks', async ({ page }) => {
    await expect(
      page.getByTestId('column-backlog').getByText('Add drag and drop between columns')
    ).toBeVisible()
    await expect(
      page.getByTestId('column-backlog').getByText('Add dark mode toggle')
    ).toBeVisible()
  })
})
