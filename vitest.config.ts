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
      alias: [
        { find: /^~(\/|$)/, replacement: path.resolve(__dirname, 'app') },
        { find: /^~~(\/|$)/, replacement: path.resolve(__dirname, 'app') },
        { find: '^vue', replacement: path.resolve(__dirname, 'node_modules/vue') },
      ],
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