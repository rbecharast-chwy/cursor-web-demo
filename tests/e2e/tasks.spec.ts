import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Task CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('creates a new task in the TODO column', async ({ page }) => {
    await page.getByTestId('add-task-todo').click()
    await expect(page.getByTestId('task-modal')).toBeVisible()

    const title = `Test task ${Date.now()}`
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('task-description-input').fill('Created by Playwright')
    await page.getByTestId('save-task-button').click()

    await expect(page.getByTestId('task-modal')).not.toBeVisible()
    await expect(page.getByTestId('column-todo').getByText(title)).toBeVisible()
  })

  test('edits an existing task', async ({ page }) => {
    // Open the first task card in TODO column
    const todoColumn = page.getByTestId('column-todo')
    const firstCard  = todoColumn.locator('[data-testid^="task-card-"]').first()
    await firstCard.hover()
    await firstCard.locator('[data-testid^="edit-task-"]').click()

    await expect(page.getByTestId('task-modal')).toBeVisible()

    const newTitle = `Edited ${Date.now()}`
    await page.getByTestId('task-title-input').fill(newTitle)
    await page.getByTestId('save-task-button').click()

    await expect(page.getByTestId('task-modal')).not.toBeVisible()
    await expect(todoColumn.getByText(newTitle)).toBeVisible()
  })

  test('changes task status via modal', async ({ page }) => {
    await page.getByTestId('add-task-todo').click()
    const title = `Status change ${Date.now()}`
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('save-task-button').click()

    // Re-open and change status
    const card = page.getByTestId('column-todo').getByText(title)
    await card.click()
    await expect(page.getByTestId('task-modal')).toBeVisible()
    await page.getByTestId('task-status-select').selectOption('IN_PROGRESS')
    await page.getByTestId('save-task-button').click()

    await expect(page.getByTestId('column-in-progress').getByText(title)).toBeVisible()
  })

  test('deletes a task', async ({ page }) => {
    // Create a task first
    await page.getByTestId('add-task-todo').click()
    const title = `Delete me ${Date.now()}`
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('save-task-button').click()

    // Delete it
    const card = page.getByTestId('column-todo').locator(`[data-testid^="task-card-"]`).filter({ hasText: title })
    await card.hover()
    await card.locator('[data-testid^="delete-task-"]').click()

    await expect(page.getByTestId('column-todo').getByText(title)).not.toBeVisible()
  })

  test('cancels the modal without saving', async ({ page }) => {
    await page.getByTestId('add-task-todo').click()
    await page.getByTestId('task-title-input').fill('This should not be saved')
    await page.getByTestId('cancel-task-button').click()
    await expect(page.getByTestId('task-modal')).not.toBeVisible()
    await expect(page.getByText('This should not be saved')).not.toBeVisible()
  })
})
