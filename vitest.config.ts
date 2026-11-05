import { existsSync } from 'node:fs'
import { defineConfig } from 'vitest/config'

// Locally, DATABASE_URL for the integration tests comes from .env.local; CI sets it directly
if (!process.env.DATABASE_URL && existsSync('.env.local')) process.loadEnvFile('.env.local')

export default defineConfig({
  test: {
    include: ['api/**/*.test.ts', 'src/**/*.test.{ts,tsx}', 'shared/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/generated/**'],
  },
})
