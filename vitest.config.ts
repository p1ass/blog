import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'app/**/*.test.ts',
      'scripts/**/*.test.ts',
      'textlint/**/*.test.ts',
    ],
    env: { TZ: 'UTC' },
  },
})
