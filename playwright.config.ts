import { defineConfig, devices } from '@playwright/test'

const port = 4173

export default defineConfig({
  testDir: './vrt',
  outputDir: './vrt/.results',
  snapshotPathTemplate:
    '{testDir}/__screenshots__/{projectName}/{arg}-{platform}{ext}',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL: `http://127.0.0.1:${port}`,
  },

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      threshold: 0,

      maxDiffPixels: 0,
    },
  },

  projects: [
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'mobile-light',
      use: {
        ...devices['Pixel 7'],
        deviceScaleFactor: 1,
        colorScheme: 'light',
      },
    },
    {
      name: 'desktop-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
    {
      name: 'mobile-dark',
      use: {
        ...devices['Pixel 7'],
        deviceScaleFactor: 1,
        colorScheme: 'dark',
      },
    },
  ],

  webServer: {
    command: 'node vrt/serve.mjs',
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: !process.env.CI,
    env: { PORT: String(port) },
  },
})
