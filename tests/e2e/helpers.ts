import { Page } from '@playwright/test'

/** Log in with demo credentials and wait for the board to load */
export async function loginAsDemoUser(page: Page) {
  await page.goto('/login')
  await page.getByTestId('email-input').fill('demo@example.com')
  await page.getByTestId('password-input').fill('demo1234')
  await page.getByTestId('login-button').click()
  await page.waitForURL('**/board')
  await page.getByTestId('kanban-board').waitFor({ state: 'visible' })
}
