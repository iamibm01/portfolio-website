import { PERSONAL_INFO } from '../../data/constants'
import { HiLocationMarker, HiBriefcase } from 'react-icons/hi'
import CountUp from '../ui/CountUp'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

function About() {
  return (
    <section id="about" className="min-h-[100svh] flex items-center py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-section-md font-semibold text-ink mb-4">About Me</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <picture>
                <source srcSet="/profile.webp" type="image/webp" />
                <img
                  src="/profile.jpg"
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover scale-150"
                />
              </picture>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="text-center p-2 md:p-4 bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/15">
                <p className="text-lg md:text-2xl font-bold text-accent">
                  <CountUp from={2015} to={2024} duration={1} delay={0.1} />
                </p>
                <p className="text-xs md:text-sm text-muted mt-1">Started Coding</p>
              </div>
              <div className="text-center p-2 md:p-4 bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/15">
                <p className="text-lg md:text-2xl font-bold text-accent">
                  <CountUp from={0} to={4} duration={1} delay={0.1} />+
                </p>
                <p className="text-xs md:text-sm text-muted mt-1">Projects</p>
              </div>
              <div className="text-center p-2 md:p-4 bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/15">
                <p className="text-lg md:text-2xl font-bold text-accent">
                  <CountUp from={0} to={10000} duration={10} delay={0.1} />+
                </p>
                <p className="text-xs md:text-sm text-muted mt-1">Coffee Cups</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <p className="text-base text-ink leading-relaxed">{PERSONAL_INFO.bio}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiLocationMarker className="w-6 h-6 text-accent flex-shrink-0" />
                <p className="text-base text-muted">{PERSONAL_INFO.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <HiBriefcase className="w-6 h-6 text-accent flex-shrink-0" />
                <p className="text-base text-muted">{PERSONAL_INFO.availability}</p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                className="inline-block px-8 py-3 bg-accent text-on-accent font-medium rounded-full hover:bg-accent/90 hover:shadow-lg transition-all"
              >
                Let's Work Together
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
