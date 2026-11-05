import { existsSync } from 'node:fs'
import { defineConfig } from 'prisma/config'

// The Prisma CLI doesn't read .env files; locally DATABASE_URL lives in .env.local (Vercel sets it in deploys)
if (!process.env.DATABASE_URL && existsSync('.env.local')) process.loadEnvFile('.env.local')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? '' },
})
