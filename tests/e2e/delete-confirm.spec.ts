import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Delete confirmation dialog', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('cancelling the dialog does not delete the task', async ({ page }) => {
    // Create a task to attempt deleting
    await page.getByTestId('add-task-todo').click()
    const title = `Keep me ${Date.now()}`
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('save-task-button').click()
    await expect(page.getByTestId('task-modal')).not.toBeVisible()

    // Click delete — dialog should appear
    const card = page.getByTestId('column-todo').locator('[data-testid^="task-card-"]').filter({ hasText: title })
    await card.hover()
    await card.locator('[data-testid^="delete-task-"]').click()

    await expect(page.getByTestId('delete-confirm-dialog')).toBeVisible()

    // Cancel — dialog closes, task remains
    await page.getByTestId('cancel-delete-button').click()

    await expect(page.getByTestId('delete-confirm-dialog')).not.toBeVisible()
    await expect(page.getByTestId('column-todo').getByText(title)).toBeVisible()
  })

  test('confirming the dialog removes the task', async ({ page }) => {
    // Create a task to delete
    await page.getByTestId('add-task-todo').click()
    const title = `Remove me ${Date.now()}`
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('save-task-button').click()
    await expect(page.getByTestId('task-modal')).not.toBeVisible()

    // Click delete — dialog should appear
    const card = page.getByTestId('column-todo').locator('[data-testid^="task-card-"]').filter({ hasText: title })
    await card.hover()
    await card.locator('[data-testid^="delete-task-"]').click()

    await expect(page.getByTestId('delete-confirm-dialog')).toBeVisible()

    // Confirm — dialog closes, task is gone
    await page.getByTestId('confirm-delete-button').click()

    await expect(page.getByTestId('delete-confirm-dialog')).not.toBeVisible()
    await expect(page.getByTestId('column-todo').getByText(title)).not.toBeVisible()
  })
})
