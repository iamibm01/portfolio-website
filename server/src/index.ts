import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import { Resend } from 'resend'
import path from 'path'
import { buildSystemPrompt } from './systemPrompt'

// Always resolve .env relative to this file, regardless of where the process is started from
// Resolve .env relative to server/ regardless of where npm run dev is invoked from
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const port = process.env.PORT ?? 3001

// Instantiated lazily so the server starts even without keys set yet
let _groq: Groq | null = null
let _resend: Resend | null = null

function getGroq(): Groq {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set')
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return _groq
}

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set')
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const myEmail = process.env.MY_EMAIL ?? ''

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ── POST /api/chat ───────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
}

app.post('/api/chat', async (req: Request<object, object, ChatRequestBody>, res: Response) => {
  const { messages } = req.body

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' })
    return
  }

  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    const reply = completion.choices[0]?.message?.content ?? ''
    res.json({ reply })
  } catch (err) {
    console.error('Groq error:', err)
    res.status(500).json({ error: 'Failed to get AI response' })
  }
})

// ── POST /api/send-lead ──────────────────────────────────────────────────────

interface LeadRequestBody {
  name: string
  email: string
  conversationSummary: string
}

app.post(
  '/api/send-lead',
  async (req: Request<object, object, LeadRequestBody>, res: Response) => {
    const { name, email, conversationSummary } = req.body

    if (!name || !email) {
      res.status(400).json({ error: 'name and email are required' })
      return
    }

    if (!myEmail) {
      console.warn('MY_EMAIL not set — skipping email send')
      res.json({ success: true, skipped: true })
      return
    }

    try {
      await getResend().emails.send({
        from: 'Portfolio Chatbot <onboarding@resend.dev>',
        to: myEmail,
        subject: `New lead from your portfolio: ${name}`,
        html: `
          <h2>New Portfolio Lead</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr />
          <h3>Conversation summary</h3>
          <pre style="white-space: pre-wrap; font-family: inherit;">${conversationSummary}</pre>
        `,
      })

      res.json({ success: true })
    } catch (err) {
      console.error('Resend error:', err)
      res.status(500).json({ error: 'Failed to send email notification' })
    }
  },
)

app.listen(port, () => {
  console.log(`Portfolio API server running on http://localhost:${port}`)
  console.log(`GROQ_API_KEY loaded: ${process.env.GROQ_API_KEY ? 'yes' : 'NO — check server/.env'}`)
})
