import type { PrismaClient } from './generated/prisma/client.js'

// Rate limits and the daily spend ceiling, kept in Postgres (decision #3). Everything goes through
// these functions, so moving to Upstash later only changes this file.

export interface LimitResult {
  allowed: boolean
  count: number
  retryAfterSec: number
}

// Fixed window: requests are counted per (key, window start). One INSERT ... ON CONFLICT statement
// increments and reads the counter atomically, so parallel requests can't both slip under the limit.
// (Prisma's upsert is a read followed by a write, which races under concurrency.)
export async function hitLimit(
  db: PrismaClient,
  key: string,
  limit: number,
  windowSec: number,
  now = Date.now()
): Promise<LimitResult> {
  const windowMs = windowSec * 1000
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs)
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "windowStart", "count")
    VALUES (${key}, ${windowStart}, 1)
    ON CONFLICT ("key", "windowStart") DO UPDATE SET "count" = "RateLimit"."count" + 1
    RETURNING "count"`
  const count = Number(rows[0]?.count ?? limit + 1)
  return {
    allowed: count <= limit,
    count,
    retryAfterSec: Math.ceil((windowStart.getTime() + windowMs - now) / 1000),
  }
}

function utcDay(now: number): string {
  return new Date(now).toISOString().slice(0, 10)
}

export async function spentTodayMicroUsd(db: PrismaClient, now = Date.now()): Promise<number> {
  const rows = await db.$queryRaw<{ microUsd: bigint }[]>`
    SELECT "microUsd" FROM "DailySpend" WHERE "day" = ${utcDay(now)}::date`
  return Number(rows[0]?.microUsd ?? 0)
}

export async function addSpend(
  db: PrismaClient,
  microUsd: number,
  now = Date.now()
): Promise<void> {
  if (microUsd <= 0) return
  await db.$executeRaw`
    INSERT INTO "DailySpend" ("day", "microUsd", "updatedAt")
    VALUES (${utcDay(now)}::date, ${Math.ceil(microUsd)}, now())
    ON CONFLICT ("day") DO UPDATE
      SET "microUsd" = "DailySpend"."microUsd" + EXCLUDED."microUsd", "updatedAt" = now()`
}
