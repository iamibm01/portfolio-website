import { PERSONAL_INFO } from '../../data/constants'
import SkillsMarquee from '../ui/SkillsMarquee'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

// Mirror of the hero: a modest portrait on the left, one statement and the bio on the right,
// then the stack runs as a quiet band across the full width, closing the section
function About() {
  return (
    <section
      id="about"
      className="min-h-[100svh] flex flex-col gap-16 pt-28 relative overflow-hidden"
    >
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 grid gap-10 md:grid-cols-12 md:gap-12 items-center content-center">
        <motion.div
          className="md:col-span-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Zoomed 1.5x around a point chosen so the face (about 51% across, 54% down) lands in the centre */}
          <div className="w-full max-w-[18rem] md:max-w-[22rem] aspect-square overflow-hidden rounded-[20px]">
            <img
              src="/profile.jpg"
              alt={PERSONAL_INFO.name}
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover scale-150 origin-[53%_62%]"
            />
          </div>
        </motion.div>

        <motion.div
          className="md:col-span-7 md:col-start-5 space-y-6"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <h2 className="text-title font-bold text-accent text-balance">
            {PERSONAL_INFO.statement}
          </h2>
          <p className="text-base text-ink max-w-xl text-pretty">{PERSONAL_INFO.bio}</p>
          <p className="text-base text-muted">{PERSONAL_INFO.availability}</p>
        </motion.div>
      </div>

      <SkillsMarquee />
    </section>
  )
}

export default About
