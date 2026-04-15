import { useState, useCallback, useRef } from 'react'
import type { Message, LeadData, ChatState } from '../types'

const API_BASE = 'http://localhost:3001'

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/** Extract name from conversation — looks for assistant asking + user responding */
function extractName(messages: Message[]): string | null {
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    if (msg.role === 'user' && i > 0) {
      const prev = messages[i - 1]
      if (
        prev.role === 'assistant' &&
        /name|call you|who.{0,10}(am i|talking|you)/i.test(prev.content)
      ) {
        const text = msg.content.trim()
        // Accept short single/two-word answers as a name
        if (text.length > 0 && text.length < 50 && !text.includes('@')) {
          return text
        }
      }
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
  return messages
    .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
    .join('\n\n')
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
    }

    setState((prev) => ({
      ...prev,
      status: 'loading',
      errorMessage: null,
      messages: [...prev.messages, userMessage],
    }))

    try {
      const updatedMessages = await new Promise<Message[]>((resolve) =>
        setState((prev) => {
          resolve(prev.messages)
          return prev
        }),
      )

      // Build payload — only role + content for the API
      const payload = updatedMessages.map((m) => ({
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

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      }

      setState((prev) => {
        const nextMessages = [...prev.messages, assistantMessage]

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
          }).catch((err) => console.error('Lead send failed:', err))

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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: message,
      }))
    }
  }, [])

  /** Used by the UI to inject the auto-greeting as the first assistant message */
  const initGreeting = useCallback((content: string) => {
    setState((prev) => {
      if (prev.messages.length > 0) return prev
      return {
        ...prev,
        messages: [
          {
            id: generateId(),
            role: 'assistant',
            content,
            timestamp: new Date(),
          },
        ],
      }
    })
  }, [])

  return { state, sendMessage, initGreeting }
}
