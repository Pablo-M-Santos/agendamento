import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['tests/e2e/**', 'tests/e2e/**/*'],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'app'),
        '~~': path.resolve(__dirname, 'app'),
        '^vue': path.resolve(__dirname, 'node_modules/vue'),
        '~~/': path.resolve(__dirname, 'app')
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['app/**/*.{ts,js}'],
      exclude: [
        'node_modules/**',
        'app/**/*.spec.ts',
        'app/**/*.test.ts',
        'app/types/**',
      ]
    }
  }
})