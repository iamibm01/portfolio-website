import type { IncomingMessage, ServerResponse } from 'node:http'

export type VercelRequest = IncomingMessage & {
  body: Record<string, unknown>
  query: Record<string, string | string[]>
  cookies: Record<string, string>
}

export type VercelResponse = ServerResponse & {
  json(data: unknown): void
  send(body: unknown): VercelResponse
  status(code: number): VercelResponse
}
