import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

export const SESSION_COOKIE = 'chat_sid'
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

function sign(id: string, secret: string): string {
  return createHmac('sha256', secret).update(id).digest('base64url')
}

// The cookie is "<uuid>.<hmac>": the server can tell its own ids from forged or edited ones
export function signSessionId(id: string, secret: string): string {
  return `${id}.${sign(id, secret)}`
}

export function verifySessionCookie(value: string | undefined, secret: string): string | null {
  if (!value) return null
  const dot = value.indexOf('.')
  if (dot < 0) return null
  const id = value.slice(0, dot)
  if (!UUID_RE.test(id)) return null
  const given = Buffer.from(value.slice(dot + 1))
  const expected = Buffer.from(sign(id, secret))
  // Constant-time compare, so response timing doesn't leak how much of a guessed signature matched
  return given.length === expected.length && timingSafeEqual(given, expected) ? id : null
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq > 0 && part.slice(0, eq).trim() === name)
      return decodeURIComponent(part.slice(eq + 1).trim())
  }
  return undefined
}

export function sessionCookieHeader(id: string, secret: string, secure: boolean): string {
  const attributes = [
    `${SESSION_COOKIE}=${encodeURIComponent(signSessionId(id, secret))}`,
    'Path=/api',
    `Max-Age=${MAX_AGE_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ]
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

// Expires the cookie, so the next message starts a new session. The old one stays stored.
export function clearSessionCookieHeader(secure: boolean): string {
  return [`${SESSION_COOKIE}=`, 'Path=/api', 'Max-Age=0', 'HttpOnly', 'SameSite=Lax']
    .concat(secure ? ['Secure'] : [])
    .join('; ')
}

export function newSessionId(): string {
  return randomUUID()
}
