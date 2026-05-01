import { useState } from 'react'
import { experience } from '../../data/experience'
import { motion, AnimatePresence } from 'framer-motion'
import SectionDivider from '../ui/SectionDivider'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(
    // Default open the current role
    experience.find(e => e.current)?.id ?? null
  )

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <section
      id="experience"
      className="snap-start min-h-[100dvh] flex items-center bg-white dark:bg-gray-900 py-20 pt-24 relative overflow-hidden"
    >
      {/* Divider → Contact (white / gray-900) */}
      <SectionDivider lightFill="#ffffff" darkFill="#111827" direction="left" />

      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
            My professional journey
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical rail line */}
            <div
              className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-primary via-primary/60 to-primary/20 dark:from-primary-light dark:via-primary-light/50 dark:to-primary-light/10"
              aria-hidden="true"
            />

            <div className="space-y-5">
              {experience.map((exp, index) => {
                const isOpen = expandedId === exp.id
                const isCurrent = exp.current

                return (
                  <motion.div
                    key={exp.id + index}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                    className="flex items-start gap-5"
                  >
                    {/* Timeline node */}
                    <div className="relative flex-shrink-0 mt-5">
                      {isCurrent ? (
                        // Pulsing filled dot for current role
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <span className="absolute inline-flex w-5 h-5 rounded-full bg-primary/40 dark:bg-primary-light/40 animate-ping" />
                          <span className="relative w-4 h-4 rounded-full bg-primary dark:bg-primary-light shadow-lg shadow-primary/40 dark:shadow-primary-light/40" />
                        </div>
                      ) : (
                        // Outlined ring for past roles
                        <div className="w-10 h-10 flex items-center justify-center">
                          <span className="w-4 h-4 rounded-full border-2 border-primary dark:border-primary-light bg-light-bg dark:bg-gray-800" />
                        </div>
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer select-none
                        ${
                          isCurrent
                            ? 'bg-white/40 dark:bg-white/10 border-primary/30 dark:border-primary-light/30 shadow-md shadow-primary/10 dark:shadow-primary-light/10'
                            : 'bg-white/25 dark:bg-white/5 border-white/40 dark:border-white/10 hover:bg-white/35 dark:hover:bg-white/8'
                        }
                        ${isOpen ? 'shadow-xl' : 'hover:shadow-md'}
                      `}
                      onClick={() => toggle(exp.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggle(exp.id)
                        }
                      }}
                    >
                      {/* Card header — always visible */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Role + current badge */}
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-heading font-semibold text-light-text-primary dark:text-white text-base leading-snug">
                                {exp.role}
                              </h3>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/15 dark:bg-primary-light/15 text-primary dark:text-primary-light text-xs font-semibold rounded-full border border-primary/25 dark:border-primary-light/25">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-light" />
                                  Current
                                </span>
                              )}
                            </div>

                            {/* Company + location */}
                            <p className="text-sm font-medium text-primary dark:text-primary-light">
                              {exp.company}
                              <span className="text-light-text-secondary dark:text-gray-500 font-normal mx-1.5">
                                ·
                              </span>
                              <span className="text-light-text-secondary dark:text-gray-400 font-normal">
                                {exp.location}
                              </span>
                            </p>
                          </div>

                          {/* Date + chevron */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-light-text-secondary dark:text-gray-400 text-right leading-relaxed whitespace-nowrap">
                              {formatDate(exp.startDate)}
                              <br />
                              <span className="text-light-text-secondary/70 dark:text-gray-500">
                                {isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                              </span>
                            </span>

                            {/* Animated chevron */}
                            <motion.svg
                              className="w-4 h-4 text-primary dark:text-primary-light flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </motion.svg>
                          </div>
                        </div>

                        {/* Description — always visible */}
                        <p className="mt-3 text-sm text-light-text-secondary dark:text-gray-400 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      {/* Expandable details */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="expand"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/30 dark:border-white/10">
                              {/* Responsibilities */}
                              <div>
                                <p className="text-xs font-bold text-light-text-primary dark:text-gray-300 mb-2.5 uppercase tracking-widest">
                                  Responsibilities
                                </p>
                                <ul className="space-y-2">
                                  {exp.responsibilities.map((r, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2.5 text-sm text-light-text-secondary dark:text-gray-400"
                                    >
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 dark:bg-primary-light/60 flex-shrink-0" />
                                      {r}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Achievements */}
                              {exp.achievements && exp.achievements.length > 0 && (
                                <div>
                                  <p className="text-xs font-bold text-primary dark:text-primary-light mb-2.5 uppercase tracking-widest">
                                    Achievements
                                  </p>
                                  <ul className="space-y-2">
                                    {exp.achievements.map((a, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2.5 text-sm text-light-text-secondary dark:text-gray-400"
                                      >
                                        <span className="mt-0.5 text-primary dark:text-primary-light flex-shrink-0">
                                          ✓
                                        </span>
                                        {a}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
