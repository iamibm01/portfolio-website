import type { ChatError, ChatEvent } from '../../shared/chat-protocol.js'
import type { Env } from './env.js'

export function jsonResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

export function errorResponse(
  status: number,
  error: ChatError,
  headers: Record<string, string> = {}
): Response {
  return jsonResponse(status, { error }, headers)
}

// Browsers always send Origin on a cross-site POST, so an unknown one is someone else's page calling us.
// A missing Origin (curl, server-to-server) is allowed; the rate limits still apply to it.
export function originAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const allowed = env.ALLOWED_ORIGINS.split(',').map(entry => entry.trim())
  if (env.VERCEL_URL) allowed.push(`https://${env.VERCEL_URL}`)
  // Outside production, any local dev or preview server (Vite moves port when 5173 is taken)
  if (env.VERCEL_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
    return true
  }
  return allowed.includes(origin)
}

// Reads at most maxBytes, so a huge body is refused without being buffered whole
export async function readJson(request: Request, maxBytes: number): Promise<unknown> {
  const declared = Number(request.headers.get('content-length') ?? 0)
  if (declared > maxBytes) throw new BodyTooLargeError()
  const reader = request.body?.getReader()
  if (!reader) return null
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      throw new BodyTooLargeError()
    }
    chunks.push(value)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

export class BodyTooLargeError extends Error {}

export function clientIp(request: Request): string {
  // Vercel sets x-forwarded-for to the real client first; elsewhere fall back to a constant bucket
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export interface SseStream {
  response: Response
  send(event: ChatEvent): void
  close(): void
}

// One turn's event stream. A comment line every 15s keeps proxies from closing an idle connection
// while the model thinks.
export function createSseStream(headers: Record<string, string> = {}): SseStream {
  const encoder = new TextEncoder()
  let controller!: ReadableStreamDefaultController<Uint8Array>
  let closed = false
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c
    },
    cancel() {
      closed = true
      clearInterval(heartbeat)
    },
  })
  const write = (chunk: string) => {
    if (!closed) controller.enqueue(encoder.encode(chunk))
  }
  const heartbeat = setInterval(() => write(': ping\n\n'), 15_000)

  return {
    response: new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
        ...headers,
      },
    }),
    send(event) {
      write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
    },
    close() {
      clearInterval(heartbeat)
      if (closed) return
      closed = true
      controller.close()
    },
  }
}
