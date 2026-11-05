import type {
  ChatError,
  ChatEvent,
  ChatRequest,
  TranscriptResponse,
} from '../../../shared/chat-protocol'

// A small Server-Sent Events client over fetch. EventSource can't POST or send a body, so the
// stream is read by hand: frames are separated by a blank line, "event:"/"data:" lines carry the
// payload, and lines starting with ":" are keep-alive comments.

const ENDPOINT = '/api/chat'
const EVENT_TYPES = new Set<ChatEvent['type']>(['status', 'text', 'done', 'error'])

export class ChatRequestError extends Error {
  constructor(readonly chatError: ChatError) {
    super(chatError.code)
  }
}

const connectionLost: ChatError = {
  code: 'internal',
  message: 'The connection dropped.',
  retryable: true,
}

export function parseFrame(frame: string): ChatEvent | null {
  const data = frame
    .split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.slice(5).trimStart())
    .join('\n')
  if (!data) return null
  try {
    const event = JSON.parse(data) as ChatEvent
    return EVENT_TYPES.has(event.type) ? event : null
  } catch {
    return null
  }
}

// Splits an accumulating buffer into complete frames; the incomplete tail is returned for later
export function takeFrames(buffer: string): { frames: string[]; rest: string } {
  const normalised = buffer.replace(/\r\n/g, '\n')
  const parts = normalised.split('\n\n')
  return { frames: parts.slice(0, -1), rest: parts.at(-1) ?? '' }
}

async function readError(response: Response): Promise<ChatError> {
  try {
    const body = (await response.json()) as { error?: ChatError }
    if (body.error?.code) return body.error
  } catch {
    // fall through to the generic error
  }
  return { code: 'internal', message: 'Something went wrong on my side.', retryable: true }
}

/** Sends one message and calls onEvent for each event until the reply is done or fails */
export async function streamChat(
  request: ChatRequest,
  onEvent: (event: ChatEvent) => void,
  signal: AbortSignal
): Promise<void> {
  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      credentials: 'same-origin',
      signal,
    })
  } catch (error) {
    if (signal.aborted) throw error
    throw new ChatRequestError(connectionLost)
  }

  const isStream = response.headers.get('content-type')?.includes('text/event-stream')
  if (!response.ok || !isStream || !response.body) {
    throw new ChatRequestError(await readError(response))
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  let finished = false
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      const { frames, rest } = takeFrames(buffer + value)
      buffer = rest
      for (const frame of frames) {
        const event = parseFrame(frame)
        if (!event) continue
        if (event.type === 'done' || event.type === 'error') finished = true
        onEvent(event)
      }
    }
  } catch (error) {
    if (signal.aborted) throw error
    throw new ChatRequestError(connectionLost)
  }
  // A stream that ends without done or error was cut off mid-reply
  if (!finished) throw new ChatRequestError(connectionLost)
}

/** Drops this browser's session cookie, so the next message starts a new conversation */
export async function resetSession(signal: AbortSignal): Promise<void> {
  const response = await fetch(ENDPOINT, { method: 'DELETE', credentials: 'same-origin', signal })
  if (!response.ok) throw new ChatRequestError(await readError(response))
}

export async function fetchTranscript(signal: AbortSignal): Promise<TranscriptResponse> {
  const response = await fetch(ENDPOINT, { credentials: 'same-origin', signal })
  if (!response.ok) throw new ChatRequestError(await readError(response))
  return (await response.json()) as TranscriptResponse
}
