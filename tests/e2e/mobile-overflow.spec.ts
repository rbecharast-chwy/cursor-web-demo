import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Mobile layout — no horizontal overflow', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('body has no horizontal overflow at 375px viewport', async ({ page }) => {
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = 375

    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('kanban board container is horizontally scrollable', async ({ page }) => {
    const board = page.getByTestId('kanban-board')
    await expect(board).toBeVisible()

    const overflowX = await board.evaluate(
      (el) => window.getComputedStyle(el).overflowX
    )
    expect(overflowX).toBe('auto')

    const { scrollWidth, clientWidth } = await board.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }))

    expect(scrollWidth).toBeGreaterThan(clientWidth)
  })

  test('all four columns render inside the scrollable container', async ({ page }) => {
    await expect(page.getByTestId('column-backlog')).toBeAttached()
    await expect(page.getByTestId('column-todo')).toBeAttached()
    await expect(page.getByTestId('column-in-progress')).toBeAttached()
    await expect(page.getByTestId('column-done')).toBeAttached()
  })
})

test.describe('Desktop layout — unchanged at 1400px', () => {
  test.use({ viewport: { width: 1400, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('all four columns are visible at desktop width', async ({ page }) => {
    await expect(page.getByTestId('column-backlog')).toBeVisible()
    await expect(page.getByTestId('column-todo')).toBeVisible()
    await expect(page.getByTestId('column-in-progress')).toBeVisible()
    await expect(page.getByTestId('column-done')).toBeVisible()
  })
})
