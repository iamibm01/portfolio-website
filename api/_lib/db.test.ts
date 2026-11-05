import type Anthropic from '@anthropic-ai/sdk'
import { PrismaPg } from '@prisma/adapter-pg'
import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PrismaClient } from './generated/prisma/client.js'
import { addSpend, hitLimit, spentTodayMicroUsd } from './limits.js'
import {
  appendTurn,
  appendVisitorMessage,
  ensureSession,
  findRetry,
  loadHistory,
  loadTranscript,
  SessionBusyError,
} from './chat/store.js'
import type { TurnResult } from './chat/engine.js'

// Integration tests against a real, migrated Postgres (Docker locally, a service container in CI).
// Skipped when DATABASE_URL is unset so a plain `npm test` still works anywhere.
const url = process.env.DATABASE_URL
const suite = url ? describe : describe.skip

let db: PrismaClient

beforeAll(() => {
  if (url) db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
})
afterAll(async () => {
  await db?.$disconnect()
})

function turn(text: string, extra: Anthropic.MessageParam[] = []): TurnResult {
  return {
    appended: [
      ...extra,
      {
        role: 'assistant',
        content: [
          { type: 'thinking', thinking: '', signature: 'sig' },
          { type: 'text', text: `${text} — raw` },
        ],
      },
    ],
    usages: [...extra.map(() => null), null],
    displayText: text,
    usage: { inputTokens: 10, outputTokens: 5, cacheRead: 100, cacheWrite: 0 },
    stopReason: 'end_turn',
    iterations: 1,
    toolCalls: [],
    filter: { dashes: 1, markers: 0, bold: 0, lengthGuard: false },
  }
}

suite('rate limits (Postgres)', () => {
  it('lets exactly `limit` requests through when they arrive in parallel', async () => {
    const key = `test:${randomUUID()}`
    const results = await Promise.all(Array.from({ length: 25 }, () => hitLimit(db, key, 20, 600)))
    expect(results.filter(r => r.allowed)).toHaveLength(20)
    expect(results.map(r => r.count).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 25 }, (_, i) => i + 1)
    )
  })

  it('starts a fresh count in the next window', async () => {
    const key = `test:${randomUUID()}`
    const now = Date.UTC(2026, 0, 1, 12, 0, 0)
    await hitLimit(db, key, 1, 60, now)
    expect((await hitLimit(db, key, 1, 60, now + 1_000)).allowed).toBe(false)
    expect((await hitLimit(db, key, 1, 60, now + 61_000)).allowed).toBe(true)
  })

  it('adds spend per UTC day without losing concurrent increments', async () => {
    const day = Date.UTC(2001, 0, 1 + Math.floor(Math.random() * 3000))
    await Promise.all(Array.from({ length: 10 }, () => addSpend(db, 1.2, day)))
    // Each increment is rounded up to a whole micro-dollar
    expect(await spentTodayMicroUsd(db, day)).toBe(20)
  })
})

suite('chat store (Postgres)', () => {
  it('stores turns append-only and replays the raw content', async () => {
    const sid = randomUUID()
    await ensureSession(db, sid, 'hash')
    await appendVisitorMessage(db, sid, 'hi', randomUUID())
    await appendTurn(db, sid, turn('Hey!'))

    const history = await loadHistory(db, sid)
    expect(history.map(m => m.role)).toEqual(['user', 'assistant'])
    // The replayed assistant message is the raw one: thinking block and unfiltered dash intact
    expect(history[1].content).toEqual([
      { type: 'thinking', thinking: '', signature: 'sig' },
      { type: 'text', text: 'Hey! — raw' },
    ])
    // The transcript the visitor sees uses the filtered text
    expect((await loadTranscript(db, sid)).map(m => m.text)).toEqual(['hi', 'Hey!'])
    const session = await db.chatSession.findUniqueOrThrow({ where: { id: sid } })
    expect(session).toMatchObject({ visitorTurns: 1, inputTokens: 10, cacheRead: 100 })
  })

  it('finds a retried message and the reply that followed it', async () => {
    const sid = randomUUID()
    const first = randomUUID()
    await ensureSession(db, sid, 'hash')
    await appendVisitorMessage(db, sid, 'question', first)
    expect(await findRetry(db, sid, first)).toMatchObject({ answered: false })

    const toolResult: Anthropic.MessageParam = {
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: 't1', content: 'ok' }],
    }
    await appendTurn(db, sid, turn('Answer.', [toolResult]))
    expect(await findRetry(db, sid, first)).toMatchObject({ answered: true, replyText: 'Answer.' })
    expect(await findRetry(db, sid, randomUUID())).toBeNull()
  })

  it('rejects the same client message id twice in a session', async () => {
    const sid = randomUUID()
    const id = randomUUID()
    await ensureSession(db, sid, 'hash')
    await appendVisitorMessage(db, sid, 'once', id)
    await expect(appendVisitorMessage(db, sid, 'twice', id)).rejects.toBeInstanceOf(
      SessionBusyError
    )
  })
})
