import { experience } from '../../data/experience'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// A ledger, the way a CV reads: when and where on the left (pinned while its entry scrolls past),
// what was done on the right. Everything is shown; there is nothing to open.
function Experience() {
  return (
    <section id="experience" className="min-h-[100svh] flex items-center py-24 relative">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <motion.h2
          className="text-title font-bold text-ink mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Experience
        </motion.h2>

        <ol className="space-y-20">
          {experience.map(function (exp, index) {
            const end = exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''

            return (
              <motion.li
                key={exp.id}
                className="grid gap-4 md:grid-cols-12 md:gap-12"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
              >
                <div className="md:col-span-4 md:sticky md:top-28 md:self-start space-y-1">
                  <p className="text-base font-semibold text-ink tabular-nums">
                    <time dateTime={exp.startDate}>{formatDate(exp.startDate)}</time>
                    {' – '}
                    {exp.current ? end : <time dateTime={exp.endDate}>{end}</time>}
                  </p>
                  <p className="text-base text-ink">{exp.company}</p>
                  <p className="text-sm text-muted">{exp.location}</p>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <h3 className="text-[clamp(1.75rem,1.2rem+1.5vw,2.5rem)] font-bold leading-tight tracking-tight text-accent">
                    {exp.role}
                  </h3>
                  <p className="text-base text-ink max-w-[60ch] text-pretty">{exp.description}</p>
                  <ul className="space-y-2 pl-5 list-disc marker:text-muted max-w-[65ch]">
                    {exp.responsibilities.map(function (item) {
                      return (
                        <li
                          key={item}
                          className="text-[1rem] leading-relaxed text-ink pl-1 text-pretty"
                        >
                          {item}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default Experience
