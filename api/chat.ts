import type { VercelRequest, VercelResponse } from './types'
import { getGroq } from './_lib/groq'
import { buildSystemPrompt } from './_lib/systemPrompt'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body as { messages: ChatMessage[] }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 400,
    })

    const reply = completion.choices[0]?.message?.content ?? ''
    return res.json({ reply })
  } catch (err) {
    console.error('Groq error:', err)
    return res.status(500).json({ error: 'Failed to get AI response' })
  }
}
