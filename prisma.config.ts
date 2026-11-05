import { existsSync } from 'node:fs'
import { defineConfig } from 'prisma/config'

// The Prisma CLI doesn't read .env files; locally DATABASE_URL lives in .env.local (Vercel sets it in deploys)
if (!process.env.DATABASE_URL && existsSync('.env.local')) process.loadEnvFile('.env.local')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // This config is only read by the Prisma CLI, so the running app keeps using the pooled DATABASE_URL.
  // Migrations take a lock that Neon's connection pooler doesn't support, so on Vercel they go through
  // the direct connection. Locally and in CI there's no pooler and only DATABASE_URL is set.
  datasource: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '' },
})
