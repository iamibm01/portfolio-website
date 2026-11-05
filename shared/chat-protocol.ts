// The contract between the browser chat and /api/chat. Imported by both sides, so it holds only
// types and constants: no runtime dependencies, nothing that grows the browser bundle. The zod
// schema that validates requests lives next to the endpoint (api/_lib/chat/request.ts).

export const MAX_MESSAGE_CHARS = 1000
export const MAX_VISITOR_TURNS = 30
export const OPENING_MESSAGE = 'Welcome to my portfolio. What brings you here today?'
export const CONTACT_EMAIL = 'hello@iamibm.me'

export interface ChatRequest {
  message: string
  /** The same id on a retry replays the stored reply instead of running a new turn */
  clientMessageId: string
  /** Honeypot: hidden from people, filled in by naive bots */
  website?: string
}

export type ChatErrorCode =
  | 'invalid'
  | 'forbidden'
  | 'rate_limited'
  | 'session_full'
  | 'budget_exhausted'
  | 'busy'
  | 'overloaded'
  | 'timeout'
  | 'refused'
  | 'internal'

export interface ChatError {
  code: ChatErrorCode
  message: string
  retryable: boolean
}

// Server-sent events for one turn, in order: status?, text*, then exactly one of done or error
export type ChatEvent =
  | { type: 'status'; label: 'thinking' }
  | { type: 'text'; delta: string }
  | { type: 'done'; messageId: string; remaining: number }
  | ({ type: 'error' } & ChatError)

// GET /api/chat: the visible transcript of the cookie's session, for restoring after a reload
export interface TranscriptMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: string
}
export interface TranscriptResponse {
  messages: TranscriptMessage[]
  remaining: number
}
