import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

if (!process.env.CI) {
  dotenv.config({ path: './config/.env.qa' });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL,
    httpCredentials: {
      username: process.env.HTTP_USERNAME || '',
      password: process.env.HTTP_PASSWORD || '',
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/userState.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/userState.json' },
      dependencies: ['setup'],
    },
  ],
});