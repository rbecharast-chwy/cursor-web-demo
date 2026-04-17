import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Task 5 - Dark mode', () => {
  test('dark mode toggle is visible in the header', async ({ page }) => {
    await loginAsDemoUser(page)
    await expect(page.getByTestId('dark-mode-toggle')).toBeVisible()
  })

  test('clicking the toggle switches to dark mode', async ({ page }) => {
    await loginAsDemoUser(page)
    await page.getByTestId('dark-mode-toggle').click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('clicking toggle again switches back to light mode', async ({ page }) => {
    await loginAsDemoUser(page)
    await page.getByTestId('dark-mode-toggle').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByTestId('dark-mode-toggle').click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('dark theme persists after page reload', async ({ page }) => {
    await loginAsDemoUser(page)

    await page.getByTestId('dark-mode-toggle').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    const storedBefore = await page.evaluate(() => localStorage.getItem('theme'))
    expect(storedBefore).toBe('dark')

    await page.reload()
    await page.getByTestId('kanban-board').waitFor({ state: 'visible' })

    await expect(page.locator('html')).toHaveClass(/dark/)

    const storedAfter = await page.evaluate(() => localStorage.getItem('theme'))
    expect(storedAfter).toBe('dark')
  })

  test('light theme persists after page reload', async ({ page }) => {
    await loginAsDemoUser(page)

    await page.getByTestId('dark-mode-toggle').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByTestId('dark-mode-toggle').click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.reload()
    await page.getByTestId('kanban-board').waitFor({ state: 'visible' })

    await expect(page.locator('html')).not.toHaveClass(/dark/)

    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(storedTheme).toBe('light')
  })
})
