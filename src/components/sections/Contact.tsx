import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { socialLinks } from '../../data/socialLinks'
import { useKeyboardInset } from '../../features/chatbot/useKeyboardInset'

// The chat is its own bundle, fetched only as the visitor nears this section
const ChatPanel = lazy(() => import('../../features/chatbot/ChatPanel'))

const CHAT_HEIGHT = 'clamp(320px, calc(100svh - 240px), 520px)'

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

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [nearView, setNearView] = useState(false)

  // Slides the section above the on-screen keyboard (see useKeyboardInset)
  useKeyboardInset(sectionRef)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNearView(true)
        observer.disconnect()
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const placeholder = (
    <div aria-hidden="true" className="rounded-[20px] bg-surface" style={{ height: CHAT_HEIGHT }} />
  )

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-[100svh] flex flex-col items-center justify-center py-8 md:py-20 relative overflow-hidden"
      style={{
        transform: 'translateY(calc(-1 * var(--keyboard-height, 0px)))',
        willChange: 'transform',
        zIndex: 10,
        position: 'relative',
      }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {nearView ? (
            <Suspense fallback={placeholder}>
              <ChatPanel />
            </Suspense>
          ) : (
            placeholder
          )}
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
