import { Router, Request, Response } from 'express'
import { getGroq } from '../lib/groq'
import { buildSystemPrompt } from '../lib/systemPrompt'

const router = Router()

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequestBody {
  messages: ChatMessage[]
}

router.post('/', async (req: Request<object, object, ChatRequestBody>, res: Response) => {
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
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 400,
    })

    const reply = completion.choices[0]?.message?.content ?? ''
    res.json({ reply })
  } catch (err) {
    console.error('Groq error:', err)
    res.status(500).json({ error: 'Failed to get AI response' })
  }
})

export default router
