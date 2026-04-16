import { skills } from '../../data/skills'
import { SkillCategory } from '../../types'
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaGitAlt, FaGithub, FaNodeJs } from 'react-icons/fa'
import {
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiSlack,
  SiNotion,
  SiExpress,
  SiPrisma,
  SiPostgresql,
} from 'react-icons/si'
import { TbApi } from 'react-icons/tb'
import { motion } from 'framer-motion'
import SectionDivider from '../ui/SectionDivider'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariant = {
  hidden: { opacity: 0, scale: 0.88, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
}

function Skills() {
  const frontendSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Frontend
  })
  const backendSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Backend
  })
  const toolsSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Tools
  })

  const getSkillIcon = function (skillName: string) {
    const name = skillName.toLowerCase()
    const iconClass = 'w-7 h-7 text-primary dark:text-primary-light'

    switch (name) {
      case 'react':
        return <FaReact className={iconClass} />
      case 'typescript':
        return <SiTypescript className={iconClass} />
      case 'tailwind css':
      case 'tailwind':
        return <SiTailwindcss className={iconClass} />
      case 'html':
      case 'html5':
        return <FaHtml5 className={iconClass} />
      case 'css':
      case 'css3':
        return <FaCss3Alt className={iconClass} />
      case 'javascript':
      case 'js':
        return <FaJs className={iconClass} />
      case 'git':
        return <FaGitAlt className={iconClass} />
      case 'github':
        return <FaGithub className={iconClass} />
      case 'next.js':
      case 'nextjs':
        return <SiNextdotjs className={iconClass} />
      case 'vite':
        return <SiVite className={iconClass} />
      case 'slack':
        return <SiSlack className={iconClass} />
      case 'notion':
        return <SiNotion className={iconClass} />
      case 'node.js':
      case 'node':
      case 'nodejs':
        return <FaNodeJs className={iconClass} />
      case 'express':
      case 'expressjs':
        return <SiExpress className={iconClass} />
      case 'prisma':
        return <SiPrisma className={iconClass} />
      case 'postgresql':
      case 'postgres':
        return <SiPostgresql className={iconClass} />
      case 'restful api':
      case 'restapi':
      case 'rest api':
        return <TbApi className={iconClass} />
      default:
        return (
          <div className="w-8 h-8 bg-primary/20 dark:bg-primary/30 rounded-lg flex items-center justify-center text-primary dark:text-primary-light font-bold text-base">
            {skillName.charAt(0)}
          </div>
        )
    }
  }

  return (
    <section
      id="skills"
      className="snap-start min-h-screen bg-white dark:bg-gray-900 py-12 pt-24 pb-20 relative overflow-hidden"
    >
      {/* Divider → Projects (white / gray-900) */}
      <SectionDivider lightFill="#ffffff" darkFill="#111827" direction="right" />

      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div
          className="text-center mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-section-sm font-heading font-semibold text-light-text-primary dark:text-white mb-2">
            Skills & Technologies
          </h2>
        </motion.div>

        {/* Frontend Skills */}
        <div className="mb-6">
          <motion.h3
            className="text-lg font-heading font-semibold text-light-text-primary dark:text-white mb-4 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Frontend Development
          </motion.h3>
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {frontendSkills.map(function (skill) {
                return (
                  <motion.div
                    key={skill.name}
                    variants={cardVariant}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-white/20 dark:bg-white/5 backdrop-blur-xl p-3 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 w-28 h-28 border border-white/30 dark:border-white/10 hover:bg-white/35 hover:border-white/50 dark:hover:bg-white/10 dark:hover:border-white/20"
                  >
                    <div className="mb-2">{getSkillIcon(skill.name)}</div>
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-sm text-center">
                      {skill.name}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Backend Development */}
        <div className="mb-6">
          <motion.h3
            className="text-lg font-heading font-semibold text-light-text-primary dark:text-white mb-4 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Backend Development
          </motion.h3>
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {backendSkills.map(function (skill) {
                return (
                  <motion.div
                    key={skill.name}
                    variants={cardVariant}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-white/20 dark:bg-white/5 backdrop-blur-xl p-3 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 w-28 h-28 border border-white/30 dark:border-white/10 hover:bg-white/35 hover:border-white/50 dark:hover:bg-white/10 dark:hover:border-white/20"
                  >
                    <div className="mb-2">{getSkillIcon(skill.name)}</div>
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-sm text-center">
                      {skill.name}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Tools & Workflow */}
        <div>
          <motion.h3
            className="text-lg font-heading font-semibold text-light-text-primary dark:text-white mb-4 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            Tools & Workflow
          </motion.h3>
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {toolsSkills.map(function (skill) {
                return (
                  <motion.div
                    key={skill.name}
                    variants={cardVariant}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-white/20 dark:bg-white/5 backdrop-blur-xl p-3 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 w-28 h-28 border border-white/30 dark:border-white/10 hover:bg-white/35 hover:border-white/50 dark:hover:bg-white/10 dark:hover:border-white/20"
                  >
                    <div className="mb-2">{getSkillIcon(skill.name)}</div>
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-sm text-center">
                      {skill.name}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
