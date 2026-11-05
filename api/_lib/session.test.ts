import { describe, expect, it } from 'vitest'
import {
  newSessionId,
  readCookie,
  sessionCookieHeader,
  signSessionId,
  verifySessionCookie,
} from './session.js'

const SECRET = 'x'.repeat(32)

describe('session cookie', () => {
  it('round-trips a signed id', () => {
    const id = newSessionId()
    expect(verifySessionCookie(signSessionId(id, SECRET), SECRET)).toBe(id)
  })

  it('rejects a forged, edited or foreign cookie', () => {
    const id = newSessionId()
    const signed = signSessionId(id, SECRET)
    expect(verifySessionCookie(signed, 'y'.repeat(32))).toBeNull()
    expect(verifySessionCookie(`${newSessionId()}${signed.slice(36)}`, SECRET)).toBeNull()
    expect(verifySessionCookie(id, SECRET)).toBeNull()
    expect(verifySessionCookie('not-a-uuid.abc', SECRET)).toBeNull()
    expect(verifySessionCookie(undefined, SECRET)).toBeNull()
  })

  it('reads the cookie back out of a Cookie header', () => {
    const header = sessionCookieHeader(newSessionId(), SECRET, true)
    const value = header.split(';')[0]
    const parsed = readCookie(`theme=dark; ${value}; other=1`, 'chat_sid')
    expect(verifySessionCookie(parsed, SECRET)).not.toBeNull()
    expect(header).toContain('HttpOnly')
    expect(header).toContain('Secure')
    expect(header).toContain('Path=/api')
  })
})
