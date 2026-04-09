import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Task 2 - Filter by priority', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('priority filter buttons render in the toolbar', async ({ page }) => {
    await expect(page.getByTestId('priority-filter-all')).toBeVisible()
    await expect(page.getByTestId('priority-filter-low')).toBeVisible()
    await expect(page.getByTestId('priority-filter-medium')).toBeVisible()
    await expect(page.getByTestId('priority-filter-high')).toBeVisible()
  })

  test('selecting a priority hides tasks with a different priority', async ({ page }) => {
    // Select HIGH
    await page.getByTestId('priority-filter-high').click()

    // Check visible tasks
    const cards = page.locator('[data-testid^="task-card-"]')
    
    // Project setup is HIGH priority
    await expect(cards.filter({ hasText: 'Project setup' })).toBeVisible()
    
    // Add dark mode toggle is MEDIUM priority, should be hidden
    await expect(page.locator('text=Add dark mode toggle')).not.toBeVisible()
  })

  test('All resets priority filtering', async ({ page }) => {
    // Select HIGH
    await page.getByTestId('priority-filter-high').click()
    await expect(page.locator('text=Add dark mode toggle')).not.toBeVisible()

    // Select ALL
    await page.getByTestId('priority-filter-all').click()
    await expect(page.locator('text=Add dark mode toggle')).toBeVisible()
  })

  test('priority and status filters work together simultaneously', async ({ page }) => {
    // Select HIGH
    await page.getByTestId('priority-filter-high').click()
    
    // Select DONE
    await page.getByTestId('filter-done').click()

    // Only 'Project setup' and 'Auth — login page' should be visible across all columns
    const cards = page.locator('[data-testid^="task-card-"]')
    await expect(cards).toHaveCount(2)
    await expect(cards.filter({ hasText: 'Project setup' })).toBeVisible()
    await expect(cards.filter({ hasText: 'Auth — login page' })).toBeVisible()

    // Other HIGH priority tasks (e.g. 'Set up CI pipeline' which is TODO) should NOT be visible
    await expect(page.locator('text=Set up CI pipeline')).not.toBeVisible()
  })
})
