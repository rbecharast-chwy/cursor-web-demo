import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test('renders the login form with pre-filled credentials', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('email-input')).toHaveValue('demo@example.com')
    await expect(page.getByTestId('password-input')).toHaveValue('demo1234')
  })

  test('redirects to /board after successful login', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-button').click()
    await page.waitForURL('**/board')
    await expect(page.getByTestId('kanban-board')).toBeVisible()
  })

  test('shows error message with wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('email-input').fill('wrong@example.com')
    await page.getByTestId('password-input').fill('wrongpassword')
    await page.getByTestId('login-button').click()
    await expect(page.getByTestId('login-error')).toBeVisible()
  })

  test('redirects unauthenticated users from /board to /login', async ({ page }) => {
    // Clear cookies first
    await page.context().clearCookies()
    await page.goto('/board')
    await page.waitForURL('**/login')
    await expect(page.getByTestId('login-form')).toBeVisible()
  })

  test('logs out successfully', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-button').click()
    await page.waitForURL('**/board')
    await page.getByTestId('logout-button').click()
    await page.waitForURL('**/login')
    await expect(page.getByTestId('login-form')).toBeVisible()
  })
})
