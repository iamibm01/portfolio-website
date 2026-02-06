import { skills } from '../../data/skills'
import { SkillCategory } from '../../types'
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaGitAlt, FaGithub, FaNodeJs } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiVite, SiSlack, SiNotion, SiExpress, SiPrisma, SiPostgresql } from 'react-icons/si'
import { TbApi } from 'react-icons/tb'

function Skills() {
  // Group skills by category
  const frontendSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Frontend
  })

  const backendSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Backend
  })

  const toolsSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Tools
  })

  // Icon mapping function with theme colors
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
      className="snap-start min-h-screen flex items-center bg-light-bg dark:bg-gray-800 py-12 pt-20 relative overflow-hidden"
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-section-sm font-heading font-semibold text-light-text-primary dark:text-white mb-2">
            Skills & Technologies
          </h2>
        </div>

        {/* Frontend Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-light-text-primary dark:text-white mb-4 text-center">
            Frontend Development
          </h3>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {frontendSkills.map(function (skill) {
                return (
                  <div
                    key={skill.name}
                    className="bg-transparent p-3 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 w-28 h-28 border border-transparent hover:bg-white/15 hover:backdrop-blur-md hover:border-white/20 dark:hover:bg-white/5 dark:hover:border-white/10"
                  >
                    <div className="mb-2">{getSkillIcon(skill.name)}</div>
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-sm text-center">
                      {skill.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Backend Development */}
        <div className="mb-6">
          <h3 className="text-lg font-heading font-semibold text-light-text-primary dark:text-white mb-4 text-center">
            Backend Development
          </h3>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {backendSkills.map(function (skill) {
                return (
                  <div
                    key={skill.name}
                    className="bg-transparent p-3 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 w-28 h-28 border border-transparent hover:bg-white/15 hover:backdrop-blur-md hover:border-white/20 dark:hover:bg-white/5 dark:hover:border-white/10"
                  >
                    <div className="mb-2">{getSkillIcon(skill.name)}</div>
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-sm text-center">
                      {skill.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tools & Workflow */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-light-text-primary dark:text-white mb-4 text-center">
            Tools & Workflow
          </h3>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {toolsSkills.map(function (skill) {
                return (
                  <div
                    key={skill.name}
                    className="bg-transparent p-3 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-105 w-28 h-28 border border-transparent hover:bg-white/15 hover:backdrop-blur-md hover:border-white/20 dark:hover:bg-white/5 dark:hover:border-white/10"
                  >
                    <div className="mb-2">{getSkillIcon(skill.name)}</div>
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-sm text-center">
                      {skill.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
