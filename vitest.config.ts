import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['app/**/*.test.ts'],
    // 日付の整形が TZ に依存していないことを検証したいので、JST 以外で回す
    env: { TZ: 'UTC' },
  },
})
