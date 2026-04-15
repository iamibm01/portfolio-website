import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane } from 'react-icons/fa'
import { HiCheckCircle, HiSparkles } from 'react-icons/hi'
import { useChat } from '../../hooks/useChat'
import { PERSONAL_INFO, SOCIAL_LINKS } from '../../data/constants'
import SectionDivider from '../ui/SectionDivider'

const GREETING =
  `Hey there! 👋 I'm an AI assistant for ${PERSONAL_INFO.name}'s portfolio. ` +
  `I can tell you about his skills, projects, and experience — or just answer any questions you have. ` +
  `What would you like to know?`

const SUGGESTIONS = [
  'What technologies does he work with?',
  'Tell me about his projects',
  'Is he available for freelance work?',
]

function getSocialIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'github':
      return <FaGithub className="w-4 h-4" />
    case 'linkedin':
      return <FaLinkedin className="w-4 h-4" />
    case 'email':
      return <FaEnvelope className="w-4 h-4" />
    default:
      return null
  }
}

export default function Contact() {
  const { state, sendMessage, initGreeting } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const greetingFired = useRef(false)

  // Auto-inject greeting once on mount
  useEffect(() => {
    if (greetingFired.current) return
    greetingFired.current = true
    initGreeting(GREETING)
  }, [initGreeting])

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 relative overflow-hidden"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Section divider from Experience */}
      <SectionDivider lightFill="#FFF8F3" darkFill="#1f2937" direction="right" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <HiSparkles className="text-primary w-5 h-5" />
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              AI-Powered Contact
            </span>
          </div>
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Let's Talk
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400 max-w-xl mx-auto">
            Chat with my AI assistant — ask anything about my work, or just say hello.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 max-w-5xl mx-auto items-start">
          {/* Left — Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div>
              <h3 className="font-heading font-semibold text-light-text-primary dark:text-white text-card-sm mb-3">
                Get in touch
              </h3>
              <p className="text-body-base text-light-text-secondary dark:text-gray-400 leading-relaxed">
                {PERSONAL_INFO.availability}. Based in {PERSONAL_INFO.location}.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="flex items-center gap-3 text-body-base text-light-text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors group"
              >
                <span className="w-9 h-9 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FaEnvelope className="w-4 h-4 text-primary dark:text-primary-light" />
                </span>
                {PERSONAL_INFO.email}
              </a>
            </div>

            <div>
              <p className="text-xs text-light-text-secondary dark:text-gray-500 uppercase tracking-widest mb-3">
                Find me on
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="w-10 h-10 rounded-full bg-light-bg dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary-light transition-all hover:scale-110"
                  >
                    {getSocialIcon(link.name)}
                  </a>
                ))}
              </div>
            </div>

            {/* Lead captured badge */}
            <AnimatePresence>
              {isLeadCaptured && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4"
                >
                  <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Message received!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                      {PERSONAL_INFO.name} will be in touch soon.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right — Chat window */}
          <motion.div
            className="flex flex-col bg-light-bg dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm"
            style={{ height: '520px' }}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {/* Chat header bar */}
            <div className="px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900">
              <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                <HiSparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-light-text-primary dark:text-white leading-none">
                  Portfolio Assistant
                </p>
                <p className="text-xs text-green-500 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scroll-smooth">
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
                      <div className="w-6 h-6 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                        <HiSparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-white dark:bg-gray-700 text-light-text-primary dark:text-gray-100 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.content}
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
                    <div className="w-6 h-6 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                      <HiSparkles className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-400 animate-bounce"
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

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion chips — show only at the start */}
            <AnimatePresence>
              {state.messages.length <= 1 && state.status !== 'loading' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-2 flex gap-2 flex-wrap"
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
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-3 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLeadCaptured ? 'Keep chatting...' : 'Type a message...'}
                disabled={state.status === 'loading'}
                className="flex-1 bg-light-bg dark:bg-gray-800 text-sm text-light-text-primary dark:text-gray-100 placeholder:text-gray-400 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary-light/40 transition disabled:opacity-50"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() || state.status === 'loading'}
                aria-label="Send message"
                className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-hero text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="w-4 h-4 translate-x-px" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
