import { Router, Request, Response } from 'express'
import { sendLeadEmails } from '../lib/email'

const router = Router()

interface LeadRequestBody {
  name: string
  email: string
  conversationSummary: string
}

router.post('/', async (req: Request<object, object, LeadRequestBody>, res: Response) => {
  const { name, email, conversationSummary } = req.body

  if (!name || !email) {
    res.status(400).json({ error: 'name and email are required' })
    return
  }

  if (!process.env.MY_EMAIL) {
    console.warn('MY_EMAIL not set — skipping email send')
    res.json({ success: true, skipped: true })
    return
  }

  try {
    await sendLeadEmails({ name, email, conversationSummary })
    res.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    res.status(500).json({ error: 'Failed to send email notification' })
  }
})

export default router
