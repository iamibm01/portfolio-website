import type Anthropic from '@anthropic-ai/sdk'
import type { TranscriptMessage } from '../../../shared/chat-protocol.js'
import { MODEL, type TurnUsage } from '../anthropic.js'
import type { Prisma, PrismaClient } from '../generated/prisma/client.js'
import type { TurnResult } from './engine.js'

// History is append-only. Rows are replayed to the model exactly as stored and never edited:
// changing an earlier turn would break the prompt cache and invalidate the replayed thinking blocks.

export class SessionBusyError extends Error {}

// A unique-constraint clash on (sessionId, seq) means another request for this session wrote first
function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002'
}

export async function ensureSession(db: PrismaClient, id: string, ipHash: string) {
  return db.chatSession.upsert({
    where: { id },
    create: { id, ipHash },
    update: {},
    select: { id: true, status: true, visitorTurns: true },
  })
}

export async function loadHistory(
  db: PrismaClient,
  sessionId: string
): Promise<Anthropic.MessageParam[]> {
  const rows = await db.chatMessage.findMany({
    where: { sessionId },
    orderBy: { seq: 'asc' },
    select: { role: true, content: true },
  })
  return rows.map(row => ({
    role: row.role,
    content: row.content as unknown as Anthropic.MessageParam['content'],
  }))
}

// For a retried request: the stored visitor message and whatever reply followed it, if any
export async function findRetry(db: PrismaClient, sessionId: string, clientMessageId: string) {
  const sent = await db.chatMessage.findUnique({
    where: { sessionId_clientMessageId: { sessionId, clientMessageId } },
    select: { seq: true },
  })
  if (!sent) return null
  const next = await db.chatMessage.findMany({
    where: { sessionId, seq: { gt: sent.seq } },
    orderBy: { seq: 'asc' },
    select: { id: true, role: true, displayText: true, clientMessageId: true },
  })
  // The reply ends where the visitor's next message begins; tool-result rows have no display text
  const end = next.findIndex(row => row.role === 'user' && row.clientMessageId)
  const reply = (end < 0 ? next : next.slice(0, end)).filter(
    row => row.role === 'assistant' && row.displayText
  )
  const last = reply.at(-1)
  return { answered: Boolean(last), replyText: last?.displayText ?? '', replyId: last?.id ?? '' }
}

async function nextSeq(tx: Prisma.TransactionClient, sessionId: string): Promise<number> {
  const last = await tx.chatMessage.findFirst({
    where: { sessionId },
    orderBy: { seq: 'desc' },
    select: { seq: true },
  })
  return (last?.seq ?? 0) + 1
}

export async function appendVisitorMessage(
  db: PrismaClient,
  sessionId: string,
  text: string,
  clientMessageId: string
): Promise<void> {
  try {
    await db.$transaction(async tx => {
      await tx.chatMessage.create({
        data: {
          sessionId,
          seq: await nextSeq(tx, sessionId),
          role: 'user',
          content: [{ type: 'text', text }],
          displayText: text,
          clientMessageId,
        },
      })
      await tx.chatSession.update({
        where: { id: sessionId },
        data: { visitorTurns: { increment: 1 } },
      })
    })
  } catch (error) {
    if (isUniqueViolation(error)) throw new SessionBusyError()
    throw error
  }
}

// Writes the turn's messages in order; the visible reply text goes on the last assistant message
export async function appendTurn(
  db: PrismaClient,
  sessionId: string,
  turn: TurnResult
): Promise<string> {
  const lastAssistant = turn.appended.findLastIndex(message => message.role === 'assistant')
  try {
    return await db.$transaction(async tx => {
      let seq = await nextSeq(tx, sessionId)
      let replyId = ''
      for (const [i, message] of turn.appended.entries()) {
        // The engine only appends assistant replies and tool results (user role); never system
        if (message.role === 'system') throw new Error('system messages are not stored')
        const row = await tx.chatMessage.create({
          data: {
            sessionId,
            seq: seq++,
            role: message.role,
            content: message.content as unknown as Prisma.InputJsonValue,
            displayText: i === lastAssistant ? turn.displayText : null,
            model: message.role === 'assistant' ? MODEL : null,
            usage: (turn.usages[i] ?? undefined) as Prisma.InputJsonValue | undefined,
          },
          select: { id: true },
        })
        if (i === lastAssistant) replyId = row.id
      }
      await tx.chatSession.update({
        where: { id: sessionId },
        data: usageIncrements(turn.usage),
      })
      return replyId
    })
  } catch (error) {
    if (isUniqueViolation(error)) throw new SessionBusyError()
    throw error
  }
}

function usageIncrements(usage: TurnUsage) {
  return {
    inputTokens: { increment: usage.inputTokens },
    outputTokens: { increment: usage.outputTokens },
    cacheRead: { increment: usage.cacheRead },
    cacheWrite: { increment: usage.cacheWrite },
  }
}

export async function loadTranscript(
  db: PrismaClient,
  sessionId: string
): Promise<TranscriptMessage[]> {
  const rows = await db.chatMessage.findMany({
    where: { sessionId, displayText: { not: null } },
    orderBy: { seq: 'asc' },
    select: { id: true, role: true, displayText: true, createdAt: true },
  })
  return rows.map(row => ({
    id: row.id,
    role: row.role,
    text: row.displayText ?? '',
    createdAt: row.createdAt.toISOString(),
  }))
}
