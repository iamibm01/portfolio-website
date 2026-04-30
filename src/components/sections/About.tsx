import React from 'react'
import { PERSONAL_INFO } from '../../data/constants'
import { HiLocationMarker, HiBriefcase } from 'react-icons/hi'
import CountUp from '../ui/CountUp'
import { motion } from 'framer-motion'
import SectionDivider from '../ui/SectionDivider'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

function About() {
  const handleSmoothScroll = function (e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      id="about"
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 relative overflow-hidden"
    >
      {/* Divider → Skills */}
      <SectionDivider lightFill="#ffffff" darkFill="#111827" direction="left" />

      {/* Dense small orange dots — intimate, precise */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            About Me
          </h2>
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
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <picture>
                <source srcSet="/profile.webp" type="image/webp" />
                <img
                  src="/profile.jpg"
                  alt={PERSONAL_INFO.name}
                  className="w-full h-full object-cover scale-150"
                />
              </picture>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/15">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">
                  <CountUp from={2015} to={2024} duration={1} delay={0.1} />
                </p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">
                  Started Coding
                </p>
              </div>
              <div className="text-center p-4 bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/15">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">
                  <CountUp from={0} to={4} duration={1} delay={0.1} />+
                </p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">
                  Projects
                </p>
              </div>
              <div className="text-center p-4 bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-xl border border-white/40 dark:border-white/15">
                <p className="text-2xl font-heading font-bold text-primary dark:text-primary-light">
                  <CountUp from={0} to={10000} duration={10} delay={0.1} />+
                </p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">
                  Coffee Cups
                </p>
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
            <p className="text-body-lg text-light-text-primary dark:text-gray-300 leading-relaxed">
              {PERSONAL_INFO.bio}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiLocationMarker className="w-6 h-6 text-primary dark:text-primary-light flex-shrink-0" />
                <p className="text-body-base text-light-text-secondary dark:text-gray-400">
                  {PERSONAL_INFO.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <HiBriefcase className="w-6 h-6 text-primary dark:text-primary-light flex-shrink-0" />
                <p className="text-body-base text-light-text-secondary dark:text-gray-400">
                  {PERSONAL_INFO.availability}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#contact"
                onClick={function (e) {
                  handleSmoothScroll(e, '#contact')
                }}
                className="inline-block px-8 py-3 bg-primary dark:bg-primary-light text-white font-medium rounded-full hover:bg-primary-dark dark:hover:bg-primary hover:shadow-lg transition-all"
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
