import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'
import { HiCheckCircle } from 'react-icons/hi'
import { BsCheck2, BsCheck2All } from 'react-icons/bs'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { useChat } from '../../hooks/useChat'
import { PERSONAL_INFO } from '../../data/constants'
import { socialLinks } from '../../data/socialLinks'
import type { ReceiptStatus } from '../../types'

function getSocialIcon(icon: string) {
  switch (icon) {
    case 'github':
      return <FaGithub className="w-5 h-5" />
    case 'linkedin':
      return <FaLinkedin className="w-5 h-5" />
    case 'email':
      return <FaEnvelope className="w-5 h-5" />
    default:
      return null
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ReceiptIcon({ status }: { status: ReceiptStatus }) {
  if (status === 'sent') return <BsCheck2 className="w-4 h-4 text-muted" />
  if (status === 'delivered') return <BsCheck2All className="w-4 h-4 text-muted" />
  return <BsCheck2All className="w-4 h-4 text-ink" />
}

const SUGGESTIONS = [
  'What technologies do you work with?',
  'Tell me about your projects',
  'Are you available for freelance work?',
]

export default function Contact() {
  const { state, sendMessage, startChat } = useChat()
  const [input, setInput] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const greetingFired = useRef(false)
  const wasLoading = useRef(false)

  // Slide the section above the keyboard using direct DOM transforms.
  // Direct style mutation (no React state) = zero re-renders = no jank.
  // When the browser pans the visual viewport to the focused input itself,
  // the offset below is 0 and this does nothing; it only covers the gap.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const keyboardOffset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      if (sectionRef.current) {
        sectionRef.current.style.transform =
          keyboardOffset > 0 ? `translateY(-${keyboardOffset}px)` : ''
      }
    }

    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  useEffect(() => {
    if (greetingFired.current) return
    greetingFired.current = true
    void startChat()
  }, [startChat])

  useEffect(() => {
    // Refocus only after the visitor's own message; the opening greeting must not
    // pull keyboard focus to the bottom of the page
    const visitorHasSent = state.messages.some(m => m.role === 'user')
    if (wasLoading.current && state.status !== 'loading' && visitorHasSent) {
      inputRef.current?.focus({ preventScroll: true })
    }
    wasLoading.current = state.status === 'loading'
  }, [state.status, state.messages])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages, state.status])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || state.status === 'loading') return
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleSuggestion = (text: string) => {
    if (state.status === 'loading') return
    void sendMessage(text)
    inputRef.current?.focus({ preventScroll: true })
  }

  const isLeadCaptured = state.status === 'lead_captured'

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-[100svh] flex flex-col items-center justify-center py-8 md:py-20 relative overflow-hidden"
      style={{ willChange: 'transform', zIndex: 10, position: 'relative' }}
    >
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col gap-6">
        {/* Header */}
        <motion.h2
          className="text-title font-bold text-ink text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          Let's talk
        </motion.h2>

        {/* Chat window: one tone step off the page in either theme, so the dot grid runs around it */}
        <motion.div
          className="flex flex-col rounded-[20px] overflow-hidden bg-surface text-ink"
          style={{ height: 'clamp(320px, calc(100svh - 240px), 520px)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {/* Chat header bar */}
          <div className="px-5 pt-4 pb-2 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-ground flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-ink leading-none">MI</span>
            </div>
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
            {isLeadCaptured && (
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

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="chat-messages flex-1 overflow-y-auto px-5 py-4 space-y-4"
          >
            <AnimatePresence initial={false}>
              {state.messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-ground flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <span className="text-xs font-bold text-ink leading-none">MI</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-accent text-on-accent rounded-br-sm'
                          : 'bg-ground text-ink rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div
                      className={`flex items-center gap-1 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <span className="text-xs text-muted">{formatTime(msg.timestamp)}</span>
                      {msg.role === 'user' && msg.receiptStatus && (
                        <ReceiptIcon status={msg.receiptStatus} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {state.status === 'loading' && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-ground flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-ink leading-none">MI</span>
                  </div>
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

            {/* Error */}
            <AnimatePresence>
              {state.status === 'error' && state.errorMessage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-700 dark:text-red-400 text-center py-1"
                >
                  {state.errorMessage}. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Suggestion chips */}
          <AnimatePresence>
            {state.messages.length <= 1 && state.status !== 'loading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-1 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
              >
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="min-h-11 text-sm px-4 rounded-full bg-ground text-ink hover:bg-ground/70 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          <div className="px-4 pt-2 pb-4 flex gap-3 items-center flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLeadCaptured ? 'Keep chatting...' : 'Type a message...'}
              disabled={state.status === 'loading'}
              style={{ fontSize: '16px' }}
              className="flex-1 min-w-0 h-11 bg-ground text-sm text-ink placeholder:text-muted rounded-full px-4 transition disabled:opacity-50"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || state.status === 'loading'}
              aria-label="Send message"
              className="w-11 h-11 flex-shrink-0 rounded-full bg-accent text-on-accent flex items-center justify-center hover:bg-accent/90 active:scale-95 transition disabled:bg-ground disabled:text-muted disabled:cursor-not-allowed disabled:scale-100"
            >
              <HiArrowUp className="w-5 h-5 stroke-[0.5]" />
            </button>
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-sm text-muted">or reach me directly</p>

          <div className="flex flex-wrap justify-center items-center gap-x-4">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={link.label ?? link.name}
                className="min-h-11 inline-flex items-center gap-2 px-2 text-sm text-ink underline-offset-4 hover:text-accent hover:underline transition-colors"
              >
                {getSocialIcon(link.icon)}
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
