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

  await Promise.all([
    resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: myEmail,
      subject: `New lead: ${name}`,
      html: ownerTemplate({ name, email, conversationSummary }),
    }),
    resend.emails.send({
      from: 'Muhammad Ibraheem <onboarding@resend.dev>',
      to: email,
      subject: 'Great connecting with you',
      html: visitorTemplate({ name }),
    }),
  ])
}
