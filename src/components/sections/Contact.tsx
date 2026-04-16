import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'
import { HiCheckCircle } from 'react-icons/hi'
import { BsCheck2, BsCheck2All } from 'react-icons/bs'
import { useChat } from '../../hooks/useChat'
import { PERSONAL_INFO } from '../../data/constants'
import type { ReceiptStatus } from '../../types'
import SectionDivider from '../ui/SectionDivider'

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ReceiptIcon({ status }: { status: ReceiptStatus }) {
  if (status === 'sent') return <BsCheck2 className="w-3.5 h-3.5 text-white/60" />
  if (status === 'delivered') return <BsCheck2All className="w-3.5 h-3.5 text-white/60" />
  return <BsCheck2All className="w-3.5 h-3.5 text-blue-300" />
}

const GREETING =
  `Hey there! 👋 I'm an AI assistant for ${PERSONAL_INFO.name}'s portfolio. ` +
  `I can tell you about his skills, projects, and experience — or just answer any questions you have. ` +
  `What would you like to know?`

const SUGGESTIONS = [
  'What technologies does he work with?',
  'Tell me about his projects',
  'Is he available for freelance work?',
]

export default function Contact() {
  const { state, sendMessage, initGreeting } = useChat()
  const [input, setInput] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const greetingFired = useRef(false)

  useEffect(() => {
    if (greetingFired.current) return
    greetingFired.current = true
    initGreeting(GREETING)
  }, [initGreeting])

  useEffect(() => {
    const el = messagesContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.messages, state.status])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || state.status === 'loading') return
    setInput('')
    await sendMessage(text)
    inputRef.current?.focus()
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
  }

  const isLeadCaptured = state.status === 'lead_captured'

  return (
    <section
      id="contact"
      className="snap-start min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 py-20 relative overflow-hidden"
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

      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Header */}
        <motion.h2
          className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          Let's Talk
        </motion.h2>

        {/* Chat window — transparent so dot grid shows through */}
        <motion.div
          className="flex-1 flex flex-col rounded-2xl overflow-hidden min-h-0"
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
          <div ref={messagesContainerRef} className="chat-messages flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
            <AnimatePresence initial={false}>
              {state.messages.map((msg) => (
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
                  <div className="flex flex-col gap-1">
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-700 text-light-text-primary dark:text-gray-100 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className={`flex items-center gap-1 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
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
                    {[0, 1, 2].map((i) => (
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
                className="px-4 pb-3 flex gap-2 flex-wrap flex-shrink-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md"
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary dark:text-primary-light dark:border-primary-light/30 hover:bg-primary/10 transition-colors whitespace-nowrap"
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLeadCaptured ? 'Keep chatting...' : 'Type a message...'}
              disabled={state.status === 'loading'}
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
      </div>
    </section>
  )
}
