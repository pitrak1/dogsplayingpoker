import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    restoreMocks: true,
    setupFiles: ['./src/test/loadEnv.ts', './src/test/vitest.setup.ts'],
    globalSetup: ['./src/test/vitest.globalSetup.ts'],
    fileParallelism: false,
    include: ['src/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})