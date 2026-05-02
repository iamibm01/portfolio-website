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
import SectionDivider from '../ui/SectionDivider'

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
  if (status === 'sent') return <BsCheck2 className="w-4 h-4 text-white/70" />
  if (status === 'delivered') return <BsCheck2All className="w-4 h-4 text-white/70" />
  return <BsCheck2All className="w-4 h-4 text-blue-300" />
}

const SUGGESTIONS = [
  'What technologies do you work with?',
  'Tell me about your projects',
  'Are you available for freelance work?',
]

export default function Contact() {
  const { state, sendMessage, startChat } = useChat()
  const [input, setInput] = useState('')
  const [chatHeight, setChatHeight] = useState(520)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const greetingFired = useRef(false)
  const wasLoading = useRef(false)

  // Set chat height once on mount based on screen size.
  // It does NOT change when the keyboard opens — the section translates
  // instead, keeping the input above the keyboard without resizing the chat.
  useEffect(() => {
    const h = window.visualViewport?.height ?? window.innerHeight
    setChatHeight(Math.min(Math.max(h - 240, 320), 520))
  }, [])

  // Slide the section above the keyboard using direct DOM transforms.
  // Direct style mutation (no React state) = zero re-renders = no jank.
  // Responds to every visualViewport resize event so it tracks the keyboard
  // animation frame-by-frame on Android Chrome.
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
    if (wasLoading.current && state.status !== 'loading') {
      inputRef.current?.focus({ preventScroll: true })
    }
    wasLoading.current = state.status === 'loading'
  }, [state.status])

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
      className="snap-start min-h-[100dvh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 py-8 md:py-20 relative overflow-hidden"
      style={{ willChange: 'transform', zIndex: 10, position: 'relative' }}
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <SectionDivider lightFill="#ffffff" darkFill="#111827" direction="right" />

      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col gap-6">
        {/* Header */}
        <motion.h2
          className="text-2xl md:text-4xl font-heading font-semibold text-primary dark:text-primary-light text-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          Let's Talk !
        </motion.h2>

        {/* Chat window — transparent so dot grid shows through */}
        <motion.div
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{ height: chatHeight }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {/* Chat header bar */}
          <div className="px-5 py-3.5 border-b border-white/40 dark:border-white/10 flex items-center gap-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white leading-none">MI</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-light-text-primary dark:text-white leading-none">
                {PERSONAL_INFO.name}
              </p>
              <p className="text-xs text-green-500 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Online
              </p>
            </div>

            {/* Lead captured confirmation — inline in header */}
            <AnimatePresence>
              {isLeadCaptured && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="ml-auto flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-3 py-1"
                >
                  <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">
                    Details sent — {PERSONAL_INFO.name} will reach out soon
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                    <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                      <span className="text-xs font-bold text-white leading-none">MI</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-700 text-light-text-primary dark:text-gray-100 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div
                      className={`flex items-center gap-1 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
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
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white leading-none">MI</span>
                  </div>
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
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
                  className="text-xs text-red-400 text-center py-1"
                >
                  {state.errorMessage} — please try again.
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
                className="px-4 pb-3 flex gap-2 overflow-x-auto flex-shrink-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md scrollbar-none [&::-webkit-scrollbar]:hidden"
              >
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary dark:text-primary-light dark:border-primary-light/30 hover:bg-primary/10 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          <div className="px-4 py-3 border-t border-white/40 dark:border-white/10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md flex gap-3 items-center flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLeadCaptured ? 'Keep chatting...' : 'Type a message...'}
              disabled={state.status === 'loading'}
              style={{ fontSize: '16px' }}
              className="flex-1 bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/10 text-sm text-light-text-primary dark:text-gray-100 placeholder:text-gray-400 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-light/40 transition disabled:opacity-50"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || state.status === 'loading'}
              aria-label="Send message"
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-hero text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <HiArrowUp className="w-5 h-5 stroke-[0.5]" />
            </button>
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 w-full max-w-sm">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <p className="text-xs text-light-text-primary dark:text-gray-500 whitespace-nowrap">
              or reach me directly
            </p>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={link.label ?? link.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 text-light-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:border-primary/40 dark:hover:border-primary-light/40 hover:bg-primary/5 dark:hover:bg-primary-light/5 transition-all text-sm"
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
