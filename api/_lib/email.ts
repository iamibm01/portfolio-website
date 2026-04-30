import { getResend } from './resend'
import { ownerTemplate } from './templates/ownerTemplate'
import { visitorTemplate } from './templates/visitorTemplate'

export interface LeadEmailPayload {
  name: string
  email: string
  conversationSummary: string
}

export async function sendLeadEmails({
  name,
  email,
  conversationSummary,
}: LeadEmailPayload): Promise<void> {
  const resend = getResend()
  const myEmail = process.env.MY_EMAIL ?? ''
  const fromDomain = process.env.FROM_DOMAIN ?? 'onboarding@resend.dev'
  const ownerName = process.env.OWNER_NAME ?? 'Portfolio Owner'

  const [ownerResult, visitorResult] = await Promise.all([
    resend.emails.send({
      from: `Portfolio <${fromDomain}>`,
      to: myEmail,
      subject: `New lead: ${name}`,
      html: ownerTemplate({ name, email, conversationSummary }),
    }),
    resend.emails.send({
      from: `${ownerName} <${fromDomain}>`,
      to: email,
      subject: 'Great connecting with you',
      html: visitorTemplate({ name }),
    }),
  ])

  if (ownerResult.error) {
    console.error('Owner notification failed:', ownerResult.error)
    throw new Error(ownerResult.error.message)
  }
  if (visitorResult.error) {
    console.error('Visitor confirmation failed:', visitorResult.error)
  }
}
