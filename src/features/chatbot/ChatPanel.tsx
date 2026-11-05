import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowUp, HiCheckCircle, HiStop } from 'react-icons/hi'
import { PERSONAL_INFO } from '../../data/constants'
import { CONTACT_EMAIL, MAX_MESSAGE_CHARS, OPENING_MESSAGE } from '../../../shared/chat-protocol'
import { useChat } from './useChat'
import type { UiMessage } from './chatReducer'

const SUGGESTIONS = [
  'What technologies do you work with?',
  'Tell me about your projects',
  'Are you available for freelance work?',
]

function formatTime(time: number): string {
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Avatar({ size }: { size: 'sm' | 'md' }) {
  return (
    <div
      aria-hidden="true"
      className={`${size === 'md' ? 'w-9 h-9' : 'w-8 h-8'} rounded-full bg-ground flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-xs font-bold text-ink leading-none">MI</span>
    </div>
  )
}

function MessageBubble({ message }: { message: UiMessage }) {
  const isVisitor = message.role === 'user'
  return (
    <div className={`flex ${isVisitor ? 'justify-end' : 'justify-start'}`}>
      {!isVisitor && (
        <div className="mr-2 mt-1">
          <Avatar size="sm" />
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-[70%]">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isVisitor
              ? 'bg-accent text-on-accent rounded-br-sm'
              : 'bg-ground text-ink rounded-bl-sm'
          }`}
        >
          {message.text}
        </div>
        <div
          className={`flex items-center gap-1 px-1 ${isVisitor ? 'justify-end' : 'justify-start'}`}
        >
          <span className="text-xs text-muted">
            {message.state === 'stopped' ? 'Stopped' : formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ChatPanel() {
  const { state, send, retry, stop } = useChat()
  const [input, setInput] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [openedAt] = useState(() => Date.now())
  const messagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const wasStreaming = useRef(false)

  const streaming = state.phase === 'streaming'
  const visitorHasSent = state.messages.some(m => m.role === 'user')
  const lastReply = [...state.messages]
    .reverse()
    .find(m => m.role === 'assistant' && m.state === 'done')

  // Refocus only after the visitor's own message; the opening greeting must not pull keyboard
  // focus to the bottom of the page
  useEffect(() => {
    if (wasStreaming.current && !streaming && visitorHasSent) {
      inputRef.current?.focus({ preventScroll: true })
    }
    wasStreaming.current = streaming
  }, [streaming, visitorHasSent])

  useEffect(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages, state.thinking, state.error])

  const handleSend = () => {
    // The honeypot is invisible to people; anything in it marks a bot, and the server refuses it
    if (honeypot) return
    send(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!streaming) handleSend()
    } else if (e.key === 'Escape' && streaming) {
      stop()
    }
  }

  const handleSuggestion = (text: string) => {
    send(text)
    inputRef.current?.focus({ preventScroll: true })
  }

  const greeting: UiMessage = {
    id: 'greeting',
    role: 'assistant',
    text: OPENING_MESSAGE,
    createdAt: state.messages[0]?.createdAt ?? openedAt,
    state: 'done',
  }

  return (
    <div
      className="flex flex-col rounded-[20px] overflow-hidden bg-surface text-ink"
      style={{ height: 'clamp(320px, calc(100svh - 240px), 520px)' }}
    >
      {/* Chat header bar */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-3 flex-shrink-0">
        <Avatar size="md" />
        <div>
          <p className="text-sm font-semibold text-ink leading-none">{PERSONAL_INFO.name}</p>
          <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online
          </p>
        </div>
      </div>

      {/* Lead captured confirmation, on its own row so it never squeezes the header */}
      <AnimatePresence>
        {state.leadCaptured && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 flex-shrink-0"
          >
            <div className="flex items-center gap-2 bg-ground rounded-xl px-3 py-2 mb-1">
              <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-ink">
                Details sent. {PERSONAL_INFO.name} will reach out soon.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages. Not a live region itself: it would read every streamed word aloud. The finished
          reply is announced once through the visually hidden region below instead. */}
      <div ref={messagesRef} className="chat-messages flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {state.phase !== 'restoring' && <MessageBubble message={greeting} />}
        {state.messages.map(message =>
          message.role === 'assistant' && message.state === 'streaming' && !message.text ? null : (
            <MessageBubble key={message.id} message={message} />
          )
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {state.thinking && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Avatar size="sm" />
              <div className="bg-ground px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error, with a way to retry and a way out */}
        {state.error && (
          <div role="alert" className="text-xs text-center py-1 space-y-2">
            <p className="text-red-700 dark:text-red-400">
              {state.error.message}{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
                Email me at {CONTACT_EMAIL}
              </a>
              {state.error.retryable && state.failed ? ' or try again.' : '.'}
            </p>
            {state.error.retryable && state.failed && state.phase === 'idle' && (
              <button
                type="button"
                onClick={retry}
                className="min-h-11 px-4 rounded-full bg-ground text-ink text-sm hover:bg-ground/70 transition-colors"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {lastReply?.text ?? ''}
      </p>

      {/* Suggestion chips */}
      <AnimatePresence>
        {state.phase === 'idle' && !visitorHasSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-1 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                className="min-h-11 text-sm px-4 rounded-full bg-ground text-ink hover:bg-ground/70 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar, or a way out once the conversation is closed */}
      {state.phase === 'closed' ? (
        <div className="px-4 pt-2 pb-4 flex flex-col items-center gap-2 flex-shrink-0">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="min-h-11 inline-flex items-center px-5 rounded-full bg-accent text-on-accent text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Email me at {CONTACT_EMAIL}
          </a>
        </div>
      ) : (
        <div className="px-4 pt-2 pb-3 flex-shrink-0">
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_MESSAGE_CHARS}
              aria-label="Message"
              placeholder={state.leadCaptured ? 'Keep chatting...' : 'Type a message...'}
              disabled={state.phase === 'restoring'}
              style={{ fontSize: '16px' }}
              className="flex-1 min-w-0 h-11 bg-ground text-sm text-ink placeholder:text-muted rounded-full px-4 transition disabled:opacity-50"
            />
            {/* Hidden from people and assistive tech; naive bots fill every field */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            {streaming ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop the reply"
                className="w-11 h-11 flex-shrink-0 rounded-full bg-ground text-ink flex items-center justify-center hover:bg-ground/70 transition"
              >
                <HiStop className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || state.phase !== 'idle'}
                aria-label="Send message"
                className="w-11 h-11 flex-shrink-0 rounded-full bg-accent text-on-accent flex items-center justify-center hover:bg-accent/90 active:scale-95 transition disabled:bg-ground disabled:text-muted disabled:cursor-not-allowed disabled:scale-100"
              >
                <HiArrowUp className="w-5 h-5 stroke-[0.5]" />
              </button>
            )}
          </div>
          <p className="mt-2 px-1 text-xs text-muted">
            {state.remaining > 0 && state.remaining <= 5
              ? `${state.remaining} message${state.remaining === 1 ? '' : 's'} left in this chat. `
              : ''}
            Chats are stored so I can follow up. Please don't share anything sensitive.
          </p>
        </div>
      )}
    </div>
  )
}
