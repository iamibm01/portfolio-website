import { useCallback, useEffect, useReducer, useRef } from 'react'
import { MAX_VISITOR_TURNS, OPENING_MESSAGE, type ChatError } from '../../../shared/chat-protocol'
import { chatReducer, initialChatState } from './chatReducer'
import { findLegacyLead, sendLegacyLead } from './legacyLead'
import { ChatRequestError, fetchTranscript, resetSession, streamChat } from './sseClient'

const FRESH_ON_LOAD = import.meta.env.VITE_CHAT_FRESH_ON_LOAD === 'true'

const unknownError: ChatError = {
  code: 'internal',
  message: 'Something went wrong on my side.',
  retryable: true,
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const streamRef = useRef<AbortController | null>(null)
  const leadSentRef = useRef(false)

  // Pick up a conversation from earlier in this browser session (the cookie identifies it).
  // With VITE_CHAT_FRESH_ON_LOAD=true (handy while testing) every load starts a new conversation.
  useEffect(() => {
    const controller = new AbortController()
    if (FRESH_ON_LOAD) {
      resetSession(controller.signal)
        .catch(() => undefined)
        .then(() => {
          if (!controller.signal.aborted) {
            dispatch({ type: 'restored', messages: [], remaining: MAX_VISITOR_TURNS })
          }
        })
      return () => controller.abort()
    }
    fetchTranscript(controller.signal)
      .then(({ messages, remaining }) => {
        // A conversation restored with a lead in it was already sent; don't send it again
        leadSentRef.current = findLegacyLead(messages) !== null
        dispatch({ type: 'restored', messages, remaining })
      })
      .catch(() => {
        // Nothing to restore: start fresh, and let the first send surface any real problem
        if (!controller.signal.aborted) {
          dispatch({ type: 'restored', messages: [], remaining: MAX_VISITOR_TURNS })
        }
      })
    return () => controller.abort()
  }, [])

  // Cancel a reply in flight if the chat unmounts
  useEffect(() => () => streamRef.current?.abort(), [])

  const run = useCallback(async (text: string, clientMessageId: string, retry: boolean) => {
    const controller = new AbortController()
    streamRef.current = controller
    dispatch({ type: 'sent', clientMessageId, text, now: Date.now(), retry })
    try {
      await streamChat(
        { message: text, clientMessageId },
        event => {
          if (event.type === 'status') dispatch({ type: 'thinking' })
          else if (event.type === 'text') dispatch({ type: 'text', delta: event.delta })
          else if (event.type === 'done') {
            dispatch({ type: 'done', messageId: event.messageId, remaining: event.remaining })
          } else dispatch({ type: 'failed', error: event })
        },
        controller.signal
      )
    } catch (error) {
      if (controller.signal.aborted) dispatch({ type: 'stopped' })
      else {
        const chatError = error instanceof ChatRequestError ? error.chatError : unknownError
        dispatch({ type: 'failed', error: chatError })
      }
    } finally {
      if (streamRef.current === controller) streamRef.current = null
    }
  }, [])

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || state.phase !== 'idle') return
      void run(trimmed, crypto.randomUUID(), false)
    },
    [run, state.phase]
  )

  // Resends with the same id: the server replays the reply if it was stored, or runs the turn again
  const retry = useCallback(() => {
    if (!state.failed || state.phase !== 'idle') return
    void run(state.failed.text, state.failed.clientMessageId, true)
  }, [run, state.failed, state.phase])

  const stop = useCallback(() => streamRef.current?.abort(), [])

  // Legacy lead capture until Phase 2: once the chat holds a name and an email, email them once
  useEffect(() => {
    if (leadSentRef.current || state.phase !== 'idle') return
    const lead = findLegacyLead([
      { role: 'assistant', text: OPENING_MESSAGE },
      ...state.messages.filter(m => m.state === 'done'),
    ])
    if (!lead) return
    leadSentRef.current = true
    void sendLegacyLead(lead).then(ok => {
      if (ok) dispatch({ type: 'lead_captured' })
    })
  }, [state.messages, state.phase])

  return { state, send, retry, stop }
}
