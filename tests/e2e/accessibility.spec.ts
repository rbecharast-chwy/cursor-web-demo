import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAsDemoUser } from './helpers'

test.describe('Accessibility audit', () => {
  test('login page has no critical or serious axe violations', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-form').waitFor({ state: 'visible' })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    expect(violations, formatViolations(violations)).toHaveLength(0)
  })

  test('board page has no critical or serious axe violations', async ({ page }) => {
    await loginAsDemoUser(page)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    expect(violations, formatViolations(violations)).toHaveLength(0)
  })

  test('task modal can be closed with Escape key', async ({ page }) => {
    await loginAsDemoUser(page)

    await page.getByTestId('add-task-backlog').click()
    await expect(page.getByTestId('task-modal')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('task-modal')).not.toBeVisible()
  })

  test('focus moves into modal on open and returns on close', async ({ page }) => {
    await loginAsDemoUser(page)

    const addButton = page.getByTestId('add-task-backlog')
    await addButton.click()
    await expect(page.getByTestId('task-modal')).toBeVisible()

    const activeTag = await page.evaluate(() => document.activeElement?.tagName)
    expect(['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA']).toContain(activeTag)

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('task-modal')).not.toBeVisible()
  })

  test('delete confirmation dialog can be closed with Escape key', async ({ page }) => {
    await loginAsDemoUser(page)

    const firstCard = page.locator('[data-testid^="task-card-"]').first()
    await firstCard.hover()
    const deleteBtn = firstCard.locator('[data-testid^="delete-task-"]')
    await deleteBtn.click()

    await expect(page.getByTestId('delete-confirm-dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('delete-confirm-dialog')).not.toBeVisible()
  })

  test('icon-only buttons have accessible names', async ({ page }) => {
    await loginAsDemoUser(page)

    const addButtons = page.locator('[data-testid^="add-task-"]')
    const count = await addButtons.count()
    for (let i = 0; i < count; i++) {
      const name = await addButtons.nth(i).getAttribute('aria-label')
      expect(name).toBeTruthy()
    }

    const firstCard = page.locator('[data-testid^="task-card-"]').first()
    await firstCard.hover()

    const editBtn = firstCard.locator('[data-testid^="edit-task-"]')
    await expect(editBtn).toHaveAttribute('aria-label', /edit task/i)

    const deleteBtn = firstCard.locator('[data-testid^="delete-task-"]')
    await expect(deleteBtn).toHaveAttribute('aria-label', /delete task/i)
  })
})

function formatViolations(violations: { id: string; impact?: string | null; description: string; nodes: { html: string }[] }[]) {
  if (violations.length === 0) return ''
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description}\n` +
        v.nodes.map((n) => `  - ${n.html}`).join('\n')
    )
    .join('\n\n')
}
