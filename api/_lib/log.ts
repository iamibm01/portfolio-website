import { createHash } from 'node:crypto'

// One JSON object per line, so Vercel's log search can filter on fields. Never log message text,
// emails or raw IPs: a session id and an IP hash are enough to follow a conversation.
export function logEvent(evt: string, fields: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ evt, ts: new Date().toISOString(), ...fields }))
}

export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}
