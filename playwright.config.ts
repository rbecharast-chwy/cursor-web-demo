import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL:           process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    trace:             'on-first-retry',
    screenshot:        'only-on-failure',
    video:             'retain-on-failure',
    // Larger viewport so the full kanban board is visible for computer use
    viewport:          { width: 1400, height: 900 },
    actionTimeout:     10_000,
    navigationTimeout: 15_000,
  },

  // Start the dev server before running tests
  webServer: {
    command:  'npm run dev',
    url:      'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout:  120_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
