import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { attachDatabasePool } from '@vercel/functions'
import { PrismaClient } from './generated/prisma/client.js'
import { getEnv } from './env.js'

let prisma: PrismaClient | null = null

// One small pool per function instance. Fluid compute reuses instances across requests, and
// attachDatabasePool releases idle clients before an instance suspends, so connections don't pile up
// on Neon. DATABASE_URL should be Neon's pooled (-pooler) connection string.
export function getDb(): PrismaClient {
  if (prisma) return prisma
  const pool = new Pool({
    connectionString: getEnv().DATABASE_URL,
    max: 3,
    idleTimeoutMillis: 5_000,
  })
  attachDatabasePool(pool)
  prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  return prisma
}
