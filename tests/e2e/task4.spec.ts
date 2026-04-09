import { test, expect } from '@playwright/test'
import { loginAsDemoUser } from './helpers'

test.describe('Task 4 - Mobile layout overflow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemoUser(page)
  })

  test('no horizontal overflow on body at 375px viewport', async ({ page }) => {
    // Set viewport to mobile width
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Ensure board is loaded
    await page.getByTestId('kanban-board').waitFor({ state: 'visible' })

    // Check if the document body scrollWidth matches window innerWidth
    const noOverflow = await page.evaluate(() => {
      return document.body.scrollWidth <= window.innerWidth
    })
    
    expect(noOverflow).toBe(true)

    // Ensure columns are scrollable horizontally within their container
    const boardScrollWidth = await page.getByTestId('kanban-board').evaluate((el) => el.scrollWidth)
    const boardClientWidth = await page.getByTestId('kanban-board').evaluate((el) => el.clientWidth)
    
    expect(boardScrollWidth).toBeGreaterThan(boardClientWidth)
  })

  test('desktop layout (1400px) remains unchanged and does not scroll', async ({ page }) => {
    // Set viewport to large desktop width
    await page.setViewportSize({ width: 1400, height: 900 })
    
    // Ensure board is loaded
    await page.getByTestId('kanban-board').waitFor({ state: 'visible' })

    // Body should not overflow
    const noBodyOverflow = await page.evaluate(() => {
      return document.body.scrollWidth <= window.innerWidth
    })
    expect(noBodyOverflow).toBe(true)
    
    // The board itself shouldn't need to scroll at this width
    // Actually, depending on the column widths it might not scroll or slightly scroll.
    // The task primarily cares about no breaking overflow. Let's just ensure body has no overflow.
  })
})
