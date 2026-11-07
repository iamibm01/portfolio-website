import { createHash } from 'node:crypto'

// One JSON object per line, so Vercel's log search can filter on fields. Never log message text,
// emails or raw IPs: a session id and an IP hash are enough to follow a conversation.
export function logEvent(evt: string, fields: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ evt, ts: new Date().toISOString(), ...fields }))
}

// What's safe to log about a caught error: its class, plus Prisma's code and the database driver's
// error kind, which say why a query failed. Never the message or the rest of meta: those can echo
// connection details or request content. Only short identifier-like values get through.
export function errorFields(error: unknown): Record<string, string> {
  const fields: Record<string, string> = {
    error: error instanceof Error ? error.constructor.name : typeof error,
  }
  if (typeof error !== 'object' || error === null) return fields
  const { code, meta } = error as { code?: unknown; meta?: { driverAdapterError?: unknown } }
  const adapterError = meta?.driverAdapterError as { cause?: Record<string, unknown> } | undefined
  const safe = (value: unknown) =>
    typeof value === 'string' && /^[A-Za-z0-9_]{1,40}$/.test(value) ? value : undefined
  const prismaCode = safe(code)
  const dbErrorKind = safe(adapterError?.cause?.kind)
  const dbErrorCode = safe(adapterError?.cause?.originalCode)
  if (prismaCode) fields.prismaCode = prismaCode
  if (dbErrorKind) fields.dbErrorKind = dbErrorKind
  if (dbErrorCode) fields.dbErrorCode = dbErrorCode
  return fields
}

export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}
