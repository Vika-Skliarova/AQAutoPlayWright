import { defineConfig, devices } from '@playwright/test';

const envConfig = require('./config/env.config.js');
envConfig.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  
  workers: process.env.CI ? 2 : undefined, 

  timeout: 30000, 

  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',

  use: {
    baseURL: process.env.BASE_URL,

    httpCredentials: {
      username: process.env.HTTP_USERNAME || '',
      password: process.env.HTTP_PASSWORD || '',
    },

    trace: 'retain-on-failure',
    screenshot: 'on',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: '.auth/userState.json', 
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: '.auth/userState.json',
      },
      dependencies: ['setup'],
    },
  ],
});