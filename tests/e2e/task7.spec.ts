import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Task drag and drop', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('drags a task to another column and keeps it there after reload', async ({ page }) => {
    const title = `Drag me ${Date.now()}`

    await page.getByTestId('add-task-backlog').click()
    await page.getByTestId('task-title-input').fill(title)
    await page.getByTestId('save-task-button').click()

    const backlogColumn = page.getByTestId('column-backlog')
    const todoColumn = page.getByTestId('column-todo')
    const backlogCard = backlogColumn.locator('[data-testid^="task-card-"]').filter({ hasText: title })

    await expect(backlogCard).toBeVisible()
    await backlogCard.dragTo(todoColumn)

    await expect(todoColumn.getByText(title)).toBeVisible()
    await expect(backlogColumn.getByText(title)).not.toBeVisible()

    await page.reload()
    await page.getByTestId('kanban-board').waitFor({ state: 'visible' })

    await expect(page.getByTestId('column-todo').getByText(title)).toBeVisible()
    await expect(page.getByTestId('column-backlog').getByText(title)).not.toBeVisible()
  })
})
