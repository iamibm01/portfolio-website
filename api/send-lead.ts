import type { VercelRequest, VercelResponse } from './types'
import { sendLeadEmails } from './_lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LeadRequestBody {
  name: string
  email: string
  conversationSummary: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, conversationSummary } = req.body as LeadRequestBody

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' })
  }

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'invalid email address' })
  }

  if (!process.env.MY_EMAIL) {
    console.warn('MY_EMAIL not set — skipping email send')
    return res.json({ success: true, skipped: true })
  }

  try {
    await sendLeadEmails({ name, email, conversationSummary: conversationSummary ?? '' })
    return res.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send email notification' })
  }
}
