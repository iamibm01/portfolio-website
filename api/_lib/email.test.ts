import type { CreateEmailOptions, CreateEmailResponse } from 'resend'
import { describe, expect, it } from 'vitest'
import { readEmailConfig, sendLeadEmails, type EmailConfig, type EmailSender } from './email.js'

const ok = { data: { id: 'id' }, error: null } as CreateEmailResponse
const err = (name: string) =>
  ({ data: null, error: { name, message: `${name} for jane@example.com` } }) as CreateEmailResponse

const config: EmailConfig = {
  from: 'hello@iamibm.me',
  ownerEmail: 'owner@example.com',
  ownerName: 'Muhammad Ibraheem',
}
const lead = { name: 'Jane Doe', email: 'jane@example.com', conversationSummary: 'hello' }

function fakeSender(replies: (CreateEmailResponse | Error)[] = []) {
  const calls: CreateEmailOptions[] = []
  const sender: EmailSender = {
    async send(payload) {
      calls.push(payload)
      const next = replies.shift() ?? ok
      if (next instanceof Error) throw next
      return next
    },
  }
  return { sender, calls }
}

describe('sendLeadEmails', () => {
  it('sends the notification with reply-to set to the visitor, then the confirmation', async () => {
    const { sender, calls } = fakeSender()
    await expect(sendLeadEmails(lead, config, sender)).resolves.toEqual({ confirmationSent: true })
    expect(calls[0]).toMatchObject({
      from: 'Portfolio <hello@iamibm.me>',
      to: 'owner@example.com',
      replyTo: 'jane@example.com',
    })
    expect(calls[1]).toMatchObject({
      from: 'Muhammad Ibraheem <hello@iamibm.me>',
      to: 'jane@example.com',
    })
  })

  it('keeps the owner address out of the visitor email', async () => {
    const { sender, calls } = fakeSender()
    await sendLeadEmails(lead, config, sender)
    expect(JSON.stringify(calls[1])).not.toContain('owner@example.com')
  })

  it('throws and skips the confirmation when the notification fails', async () => {
    const { sender, calls } = fakeSender([err('validation_error')])
    await expect(sendLeadEmails(lead, config, sender)).rejects.toThrow('validation_error')
    expect(calls).toHaveLength(1)
  })

  it('still succeeds when only the confirmation fails, without exposing the address', async () => {
    const { sender } = fakeSender([ok, err('validation_error')])
    const result = await sendLeadEmails(lead, config, sender)
    expect(result).toEqual({ confirmationSent: false, confirmationError: 'validation_error' })
    expect(JSON.stringify(result)).not.toContain('jane@example.com')
  })

  it('still succeeds when the confirmation throws', async () => {
    const { sender } = fakeSender([ok, new TypeError('socket hang up')])
    await expect(sendLeadEmails(lead, config, sender)).resolves.toEqual({
      confirmationSent: false,
      confirmationError: 'TypeError',
    })
  })
})

describe('readEmailConfig', () => {
  const good = {
    RESEND_API_KEY: 're_x',
    FROM_DOMAIN: 'hello@iamibm.me',
    MY_EMAIL: 'owner@example.com',
  }

  it('accepts a complete configuration', () => {
    expect(readEmailConfig({ ...good, OWNER_NAME: 'Muhammad Ibraheem' })).toEqual({
      ok: true,
      config: {
        from: 'hello@iamibm.me',
        ownerEmail: 'owner@example.com',
        ownerName: 'Muhammad Ibraheem',
      },
    })
  })

  it('names every missing variable instead of falling back to a test sender', () => {
    expect(readEmailConfig({})).toEqual({
      ok: false,
      problems: ['RESEND_API_KEY is not set', 'FROM_DOMAIN is not set', 'MY_EMAIL is not set'],
    })
  })

  it('rejects a bare domain as the sender', () => {
    const result = readEmailConfig({ ...good, FROM_DOMAIN: 'iamibm.me' })
    expect(result.ok).toBe(false)
  })

  it("refuses Resend's test sender in production only", () => {
    const test = { ...good, FROM_DOMAIN: 'onboarding@resend.dev' }
    expect(readEmailConfig({ ...test, VERCEL_ENV: 'production' }).ok).toBe(false)
    expect(readEmailConfig(test).ok).toBe(true)
  })
})
