import Anthropic from '@anthropic-ai/sdk'
import { waitUntil } from '@vercel/functions'
import {
  MAX_VISITOR_TURNS,
  type ChatError,
  type ChatRequest,
  type TranscriptResponse,
} from '../shared/chat-protocol.js'
import { costMicroUsd, getAnthropic } from './_lib/anthropic.js'
import { ChatTurnError, runTurn } from './_lib/chat/engine.js'
import { ChatRequestSchema } from './_lib/chat/request.js'
import {
  appendTurn,
  appendVisitorMessage,
  ensureSession,
  findRetry,
  loadHistory,
  loadTranscript,
  SessionBusyError,
} from './_lib/chat/store.js'
import { getDb } from './_lib/db.js'
import { getEnv, type Env } from './_lib/env.js'
import {
  BodyTooLargeError,
  clientIp,
  createSseStream,
  errorResponse,
  jsonResponse,
  originAllowed,
  readJson,
} from './_lib/http.js'
import { addSpend, hitLimit, spentTodayMicroUsd } from './_lib/limits.js'
import { errorFields, hashIp, logEvent } from './_lib/log.js'
import {
  clearSessionCookieHeader,
  newSessionId,
  readCookie,
  SESSION_COOKIE,
  sessionCookieHeader,
  verifySessionCookie,
} from './_lib/session.js'

const MAX_BODY_BYTES = 8 * 1024
const IP_LIMITS = [
  { name: '10m', limit: 20, windowSec: 10 * 60 },
  { name: '1d', limit: 100, windowSec: 24 * 60 * 60 },
]

const fail = (code: ChatError['code'], message: string, retryable = false): ChatError => ({
  code,
  message,
  retryable,
})

function sessionFrom(request: Request, env: Env) {
  const cookie = readCookie(request.headers.get('cookie'), SESSION_COOKIE)
  const existing = verifySessionCookie(cookie, env.SESSION_SECRET)
  const id = existing ?? newSessionId()
  const secure = new URL(request.url).protocol === 'https:'
  const cookieHeaders: Record<string, string> = existing
    ? {}
    : { 'Set-Cookie': sessionCookieHeader(id, env.SESSION_SECRET, secure) }
  return { id, cookieHeaders }
}

async function getTranscript(request: Request, env: Env): Promise<Response> {
  const existing = verifySessionCookie(
    readCookie(request.headers.get('cookie'), SESSION_COOKIE),
    env.SESSION_SECRET
  )
  if (!existing) return jsonResponse(200, { messages: [], remaining: MAX_VISITOR_TURNS })
  const db = getDb()
  const session = await db.chatSession.findUnique({
    where: { id: existing },
    select: { visitorTurns: true },
  })
  const body: TranscriptResponse = {
    messages: session ? await loadTranscript(db, existing) : [],
    remaining: Math.max(0, MAX_VISITOR_TURNS - (session?.visitorTurns ?? 0)),
  }
  return jsonResponse(200, body)
}

async function postMessage(request: Request, env: Env): Promise<Response> {
  if (!originAllowed(request, env)) {
    return errorResponse(403, fail('forbidden', 'This chat only works on iamibm.me.'))
  }

  let input: ChatRequest
  try {
    const parsed = ChatRequestSchema.safeParse(await readJson(request, MAX_BODY_BYTES))
    if (!parsed.success) return errorResponse(400, fail('invalid', 'That message looks off.'))
    input = parsed.data
  } catch (error) {
    const tooBig = error instanceof BodyTooLargeError
    return errorResponse(tooBig ? 413 : 400, fail('invalid', 'That message looks off.'))
  }

  const ipHash = hashIp(clientIp(request), env.IP_SALT)
  if (input.website) {
    logEvent('honeypot', { ipHash })
    return errorResponse(400, fail('invalid', 'That message looks off.'))
  }

  const db = getDb()
  const session = sessionFrom(request, env)
  const { visitorTurns, status } = await ensureSession(db, session.id, ipHash)
  if (status === 'blocked') {
    return errorResponse(403, fail('forbidden', 'This chat is closed.'), session.cookieHeaders)
  }

  // A retry of a message already answered replays the stored reply; one not yet answered re-runs
  // the turn without storing the visitor's message twice
  const retry = await findRetry(db, session.id, input.clientMessageId)
  const remainingAfter = Math.max(0, MAX_VISITOR_TURNS - visitorTurns - (retry ? 0 : 1))
  if (retry?.answered) {
    const sse = createSseStream(session.cookieHeaders)
    sse.send({ type: 'text', delta: retry.replyText })
    sse.send({ type: 'done', messageId: retry.replyId, remaining: remainingAfter })
    sse.close()
    return sse.response
  }

  if (!retry) {
    if (visitorTurns >= MAX_VISITOR_TURNS) {
      return errorResponse(
        429,
        fail('session_full', "We've covered a lot here. Let's continue over email."),
        session.cookieHeaders
      )
    }
    for (const { name, limit, windowSec } of IP_LIMITS) {
      const result = await hitLimit(db, `chat:ip:${ipHash}:${name}`, limit, windowSec)
      if (!result.allowed) {
        logEvent('rate_limited', { sid: session.id, ipHash, window: name })
        return errorResponse(
          429,
          fail('rate_limited', "You're sending messages faster than I can keep up.", true),
          { ...session.cookieHeaders, 'Retry-After': String(result.retryAfterSec) }
        )
      }
    }
    if ((await spentTodayMicroUsd(db)) >= env.DAILY_BUDGET_USD * 1_000_000) {
      logEvent('budget_exhausted', { sid: session.id })
      return errorResponse(
        503,
        fail('budget_exhausted', 'The chat is resting for today.'),
        session.cookieHeaders
      )
    }
    try {
      await appendVisitorMessage(db, session.id, input.message, input.clientMessageId)
    } catch (error) {
      if (error instanceof SessionBusyError) {
        return errorResponse(
          409,
          fail('busy', "I'm still answering your last message.", true),
          session.cookieHeaders
        )
      }
      throw error
    }
  }

  const history = await loadHistory(db, session.id)
  const sse = createSseStream(session.cookieHeaders)
  const started = Date.now()
  let firstTextAt = 0

  // The stream is returned right away; the turn keeps running and writes into it. waitUntil keeps
  // the function alive until the turn is stored, even if the visitor closes the tab mid-reply.
  const work = (async () => {
    try {
      const turn = await runTurn(history, {
        stream: (params, options) => getAnthropic().messages.stream(params, options),
        tools: [],
        sessionId: session.id,
        emit: event => {
          if (event.type === 'text' && !firstTextAt) firstTextAt = Date.now()
          sse.send(event)
        },
      })
      const replyId = await appendTurn(db, session.id, turn)
      const cost = costMicroUsd(turn.usage)
      await addSpend(db, cost)
      sse.send({ type: 'done', messageId: replyId, remaining: remainingAfter })

      const { inputTokens, outputTokens, cacheRead, cacheWrite } = turn.usage
      logEvent('chat_turn', {
        sid: session.id,
        ipHash,
        turn: MAX_VISITOR_TURNS - remainingAfter,
        latencyMs: Date.now() - started,
        ttftMs: firstTextAt ? firstTextAt - started : null,
        iterations: turn.iterations,
        tools: turn.toolCalls,
        stop: turn.stopReason,
        inputTokens,
        outputTokens,
        cacheRead,
        cacheWrite,
        cacheRatio: +(cacheRead / Math.max(1, cacheRead + cacheWrite + inputTokens)).toFixed(3),
        costUsd: +(cost / 1_000_000).toFixed(6),
        filtered: turn.filter,
      })
    } catch (error) {
      const chatError =
        error instanceof ChatTurnError
          ? error.chatError
          : error instanceof SessionBusyError
            ? fail('busy', "I'm still answering your last message.", true)
            : fail('internal', 'Something went wrong on my side.', true)
      sse.send({ type: 'error', ...chatError })
      logEvent('chat_error', {
        sid: session.id,
        ipHash,
        code: chatError.code,
        latencyMs: Date.now() - started,
        // No error messages: SDK messages can echo request content
        ...errorFields(error),
        status: error instanceof Anthropic.APIError ? error.status : undefined,
      })
    } finally {
      sse.close()
    }
  })()
  waitUntil(work)
  return sse.response
}

// DELETE /api/chat: forget this browser's conversation and start fresh on the next message.
// The stored transcript is kept (retention handles it later); only the cookie link to it goes.
function startOver(request: Request, env: Env): Response {
  if (!originAllowed(request, env)) {
    return errorResponse(403, fail('forbidden', 'This chat only works on iamibm.me.'))
  }
  const secure = new URL(request.url).protocol === 'https:'
  return new Response(null, {
    status: 204,
    headers: { 'Set-Cookie': clearSessionCookieHeader(secure), 'Cache-Control': 'no-store' },
  })
}

export default {
  async fetch(request: Request): Promise<Response> {
    let env: Env
    try {
      env = getEnv()
    } catch (error) {
      logEvent('config_error', { error: error instanceof Error ? error.message : String(error) })
      return errorResponse(500, fail('internal', 'The chat is not set up yet.'))
    }
    try {
      if (request.method === 'GET') return await getTranscript(request, env)
      if (request.method === 'POST') return await postMessage(request, env)
      if (request.method === 'DELETE') return startOver(request, env)
      return errorResponse(405, fail('invalid', 'Method not allowed.'), {
        Allow: 'GET, POST, DELETE',
      })
    } catch (error) {
      logEvent('chat_error', {
        code: 'internal',
        ...errorFields(error),
      })
      return errorResponse(500, fail('internal', 'Something went wrong on my side.', true))
    }
  },
}
