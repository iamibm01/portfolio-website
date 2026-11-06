import { z } from 'zod'
import type { CreateEmailOptions, CreateEmailResponse } from 'resend'
import { ownerTemplate } from './templates/ownerTemplate.js'
import { visitorTemplate } from './templates/visitorTemplate.js'

export interface LeadEmailPayload {
  name: string
  email: string
  conversationSummary: string
}

export interface EmailConfig {
  from: string
  ownerEmail: string
  ownerName: string
}

export type EmailConfigResult =
  | { ok: true; config: EmailConfig }
  | { ok: false; problems: string[] }

export interface EmailSender {
  send(payload: CreateEmailOptions): Promise<CreateEmailResponse>
}

const isEmail = (value: string) => z.email().safeParse(value).success

/**
 * Reads the email settings and names everything that's wrong. There's deliberately no fallback
 * sender: Resend's shared onboarding@resend.dev only delivers to the Resend account owner, so
 * falling back to it would lose visitor emails without any visible error.
 */
export function readEmailConfig(
  env: Record<string, string | undefined> = process.env
): EmailConfigResult {
  const problems: string[] = []
  const from = env.FROM_DOMAIN?.trim() ?? ''
  const ownerEmail = env.MY_EMAIL?.trim() ?? ''

  if (!env.RESEND_API_KEY?.trim()) problems.push('RESEND_API_KEY is not set')
  if (!from) problems.push('FROM_DOMAIN is not set')
  else if (!isEmail(from)) problems.push('FROM_DOMAIN must be a full address, like name@domain.com')
  else if (from.endsWith('@resend.dev') && env.VERCEL_ENV === 'production') {
    problems.push('FROM_DOMAIN uses resend.dev, which only delivers to the Resend account owner')
  }
  if (!ownerEmail) problems.push('MY_EMAIL is not set')
  else if (!isEmail(ownerEmail)) problems.push('MY_EMAIL is not a valid email address')

  if (problems.length) return { ok: false, problems }
  return {
    ok: true,
    config: { from, ownerEmail, ownerName: env.OWNER_NAME?.trim() || 'Portfolio Owner' },
  }
}

/**
 * Sends the notification to the owner, then the confirmation to the visitor. The notification decides
 * the outcome: if it fails this throws, because the lead didn't arrive. If only the confirmation
 * fails the lead is safe, so that's reported in the result instead of failing the whole request.
 * Errors carry only Resend's error name, because its messages can contain the visitor's address.
 */
export async function sendLeadEmails(
  { name, email, conversationSummary }: LeadEmailPayload,
  { from, ownerEmail, ownerName }: EmailConfig,
  sender: EmailSender
): Promise<{ confirmationSent: boolean; confirmationError?: string }> {
  const ownerResult = await sender.send({
    from: `Portfolio <${from}>`,
    to: ownerEmail,
    // So pressing Reply on the notification answers the visitor
    replyTo: email,
    subject: `New lead: ${name}`,
    html: ownerTemplate({ name, email, conversationSummary }),
  })
  if (ownerResult.error) throw new Error(ownerResult.error.name)

  // No replyTo here: a reply goes to the From address, which keeps MY_EMAIL private
  try {
    const visitorResult = await sender.send({
      from: `${ownerName} <${from}>`,
      to: email,
      subject: 'Great connecting with you',
      html: visitorTemplate({ name }),
    })
    if (visitorResult.error) {
      return { confirmationSent: false, confirmationError: visitorResult.error.name }
    }
    return { confirmationSent: true }
  } catch (error) {
    return {
      confirmationSent: false,
      confirmationError: error instanceof Error ? error.name : 'unknown',
    }
  }
}
