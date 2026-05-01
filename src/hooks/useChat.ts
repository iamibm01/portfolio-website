import { useState, useCallback, useRef } from 'react'
import type { Message, LeadData, ChatState } from '../types'

function markLastUserMessage(messages: Message[], status: Message['receiptStatus']): Message[] {
  const idx = [...messages].reverse().findIndex(m => m.role === 'user')
  if (idx === -1) return messages
  const realIdx = messages.length - 1 - idx
  return messages.map((m, i) => (i === realIdx ? { ...m, receiptStatus: status } : m))
}

// Empty string = relative URL, so /api/chat resolves to the same domain (Vercel serverless).
// Override with VITE_API_BASE=http://localhost:3001 in .env.local for local Express dev.
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function toTitleCase(str: string): string {
  return str.replace(/\b[a-z]/g, c => c.toUpperCase())
}

/** Extract name from conversation — looks for assistant asking + user responding */
function extractName(messages: Message[]): string | null {
  // Strip leading filler words, possibly chained ("ok so yeah, ...")
  const fillerRe = /^(?:(?:well|so|sure|okay|ok|yeah|yes|hi|hey|uh|um|hm|hmm)[,!.]?\s+)+/i
  const introRe =
    /^(?:i(?:'m| am)|my name(?:'s| is)|it'?s|it is|this is|that'?s|that is|(?:(?:the|my)\s+)?name(?:'?s| is)|(?:just\s+)?call(?:ing)? me|you can call me|just)\s+([A-Za-z][a-z]+(?:\s+[A-Za-z][a-z]+)?)/i
  // Bare-name fallback: 1-3 words, only letters/hyphens/apostrophes
  const bareNameRe = /^[A-Za-z][A-Za-z'-]{1,19}(?:\s+[A-Za-z][A-Za-z'-]{1,19}){0,2}$/

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (msg.role !== 'user') continue
    let text = msg.content.trim()
    if (!text || text.includes('@')) continue

    const prevIsNameAsk =
      i > 0 &&
      messages[i - 1].role === 'assistant' &&
      /name|call you/i.test(messages[i - 1].content)

    if (prevIsNameAsk) {
      text = text.replace(fillerRe, '').trim()
      const introMatch = text.match(introRe)
      if (introMatch) return toTitleCase(introMatch[1])
      if (bareNameRe.test(text)) return toTitleCase(text)
    }
  }
  return null
}

/** Scan all messages for an email address */
function extractEmail(messages: Message[]): string | null {
  const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  for (const msg of messages) {
    const match = msg.content.match(emailRe)
    if (match) return match[0]
  }
  return null
}

/** Build a plain-text summary for the notification email */
function buildSummary(messages: Message[]): string {
  return messages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n')
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    status: 'idle',
    lead: null,
    errorMessage: null,
  })

  // Prevent sending the lead notification more than once
  const leadSentRef = useRef(false)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      receiptStatus: 'sent',
    }

    setState(prev => ({
      ...prev,
      status: 'loading',
      errorMessage: null,
      messages: [...prev.messages, userMessage],
    }))

    try {
      const updatedMessages = await new Promise<Message[]>(resolve =>
        setState(prev => {
          resolve(prev.messages)
          return prev
        })
      )

      // Build payload — only role + content for the API
      const payload = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = (await res.json()) as { reply: string }

      // Simulate a natural reading/typing pause before showing the reply
      await new Promise(resolve => setTimeout(resolve, 500))

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }

      setState(prev => {
        const nextMessages = markLastUserMessage([...prev.messages, assistantMessage], 'delivered')

        // Try to detect name + email from the full conversation so far
        const name = extractName(nextMessages)
        const email = extractEmail(nextMessages)

        if (name && email && !leadSentRef.current) {
          leadSentRef.current = true
          const lead: LeadData = {
            name,
            email,
            conversationSummary: buildSummary(nextMessages),
          }

          // Fire-and-forget lead notification
          fetch(`${API_BASE}/api/send-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          }).catch(err => console.error('Lead send failed:', err))

          return {
            messages: nextMessages,
            status: 'lead_captured' as const,
            lead,
            errorMessage: null,
          }
        }

        return {
          ...prev,
          messages: nextMessages,
          status: 'idle' as const,
        }
      })

      // Advance last user message to 'seen' after a short delay
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          messages: markLastUserMessage(prev.messages, 'seen'),
        }))
      }, 1200)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: message,
      }))
    }
  }, [])

  const startChat = useCallback(async () => {
    setState(prev => {
      if (prev.messages.length > 0) return prev
      return { ...prev, status: 'loading' }
    })

    await new Promise(resolve => setTimeout(resolve, 600))

    setState(prev => {
      if (prev.messages.length > 0) return prev
      return {
        ...prev,
        status: 'idle',
        messages: [
          {
            id: generateId(),
            role: 'assistant',
            content: 'Welcome to my portfolio. What brings you here today?',
            timestamp: new Date(),
          },
        ],
      }
    })
  }, [])

  return { state, sendMessage, startChat }
}
