import { getResend } from './resend'
import { ownerTemplate } from './templates/ownerTemplate'
import { visitorTemplate } from './templates/visitorTemplate'

export interface LeadEmailPayload {
  name: string
  email: string
  conversationSummary: string
}

export async function sendLeadEmails({ name, email, conversationSummary }: LeadEmailPayload): Promise<void> {
  const resend = getResend()
  const myEmail = process.env.MY_EMAIL ?? ''
  const fromDomain = process.env.FROM_DOMAIN ?? 'onboarding@resend.dev'

  const [ownerResult, visitorResult] = await Promise.all([
    resend.emails.send({
      from: `Portfolio <${fromDomain}>`,
      to: myEmail,
      subject: `New lead: ${name}`,
      html: ownerTemplate({ name, email, conversationSummary }),
    }),
    resend.emails.send({
      from: `Muhammad Ibraheem <${fromDomain}>`,
      to: email,
      subject: 'Great connecting with you',
      html: visitorTemplate({ name }),
    }),
  ])

  // Resend SDK returns { data, error } — it never throws
  if (ownerResult.error) {
    console.error('Owner notification failed:', ownerResult.error)
    throw new Error(ownerResult.error.message)
  }
  if (visitorResult.error) {
    console.error('Visitor confirmation failed:', visitorResult.error)
  }
}
