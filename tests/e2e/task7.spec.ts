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
    const todoDropzone = page.getByTestId('task-dropzone-todo')
    const backlogCard = backlogColumn.locator('[data-testid^="task-card-"]').filter({ hasText: title })

    await expect(backlogCard).toBeVisible()
    const updateRequest = page.waitForResponse((response) =>
      response.url().includes('/api/tasks/') &&
      response.request().method() === 'PUT' &&
      response.ok()
    )

    const sourceBox = await backlogCard.boundingBox()
    const targetBox = await todoDropzone.boundingBox()

    if (!sourceBox || !targetBox) throw new Error('Missing drag source or target bounds')

    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + Math.min(targetBox.height / 2, 120), {
      steps: 12,
    })
    await page.mouse.up()

    const updateResponse = await updateRequest
    const movedTaskId = updateResponse.url().split('/').pop() ?? ''

    await expect(todoColumn.locator(`[data-testid="task-card-${movedTaskId}"]`)).toBeVisible()
    await expect(backlogColumn.locator(`[data-testid="task-card-${movedTaskId}"]`)).toHaveCount(0)

    await page.reload()
    await page.getByTestId('kanban-board').waitFor({ state: 'visible' })

    await expect(page.getByTestId('column-todo').locator(`[data-testid="task-card-${movedTaskId}"]`)).toBeVisible()
    await expect(page.getByTestId('column-backlog').locator(`[data-testid="task-card-${movedTaskId}"]`)).toHaveCount(0)
  })
})
