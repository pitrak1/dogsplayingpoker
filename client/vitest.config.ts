import { defineConfig } from 'vitest/config'
import path from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,  // makes describe, it, expect global like Jest
    // Tests spy on modules (useAuth, useNavigate, URL.createObjectURL). Without this
    // a spy set in one test is still in place for the next one in the file.
    restoreMocks: true,
    setupFiles: ['./src/test/vitest.setup.tsx'],
    fileParallelism: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})