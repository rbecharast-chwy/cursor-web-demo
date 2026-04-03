import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Task 1 - Task counter per column', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('displays the current task count in every column header', async ({ page }) => {
    const backlogCol = page.getByTestId('column-backlog')
    await expect(backlogCol.locator('.font-bold.rounded-full')).not.toBeEmpty()

    const todoCol = page.getByTestId('column-todo')
    await expect(todoCol.locator('.font-bold.rounded-full')).not.toBeEmpty()
  })

  test('count updates immediately when a task is created or deleted', async ({ page }) => {
    const todoCol = page.getByTestId('column-todo')
    const countBadge = todoCol.locator('.font-bold.rounded-full')
    
    await expect(countBadge).not.toBeEmpty()
    const initialCountStr = await countBadge.textContent()
    const initialCount = parseInt(initialCountStr || '0', 10)

    // Create a task
    await page.getByTestId('add-task-todo').click()
    const title = `New task ${Date.now()}`
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('save-task-button').click()

    await expect(countBadge).toHaveText((initialCount + 1).toString())

    // Delete the task
    const card = todoCol.locator(`[data-testid^="task-card-"]`).filter({ hasText: title })
    await card.hover()
    await card.locator('[data-testid^="delete-task-"]').click()

    await expect(countBadge).toHaveText(initialCount.toString())
  })

  test('count reflects only visible tasks when a status filter is active', async ({ page }) => {
    const todoCol = page.getByTestId('column-todo')
    const countBadge = todoCol.locator('.font-bold.rounded-full')
    const inProgressCol = page.getByTestId('column-in-progress')
    const inProgressBadge = inProgressCol.locator('.font-bold.rounded-full')

    // Filter by IN_PROGRESS
    await page.getByTestId('filter-in-progress').click()

    // TODO column should now have 0 visible tasks
    await expect(countBadge).toHaveText('0')
    
    // IN_PROGRESS column should have > 0
    const ipCountStr = await inProgressBadge.textContent()
    const ipCount = parseInt(ipCountStr || '0', 10)
    expect(ipCount).toBeGreaterThan(0)
  })
})
