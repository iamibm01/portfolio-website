import { skills } from '../../data/skills'
import { SkillCategory } from '../../types'
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaGitAlt, FaGithub } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss, SiNextdotjs, SiVite, SiSlack, SiNotion } from 'react-icons/si'

function Skills() {
  // Group skills by category
  const frontendSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Frontend
  })

  const toolsSkills = skills.filter(function (skill) {
    return skill.category === SkillCategory.Tools
  })

  // Icon mapping function with theme colors
  const getSkillIcon = function (skillName: string) {
    const name = skillName.toLowerCase()
    const iconClass = 'w-8 h-8 text-primary dark:text-primary-light'

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
      default:
        return (
          <div className="w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-lg flex items-center justify-center text-primary dark:text-primary-light font-bold text-xl">
            {skillName.charAt(0)}
          </div>
        )
    }
  }

  return (
    <section
      id="skills"
      className="snap-start min-h-screen flex items-center bg-light-bg dark:bg-gray-800 py-20 pt-32"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16">
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Skills & Technologies
          </h2>
        </div>

        {/* Frontend Skills */}
        <div className="mb-12">
          <h3 className="text-card-md font-heading font-semibold text-light-text-primary dark:text-white mb-10 text-center">
            Frontend Development
          </h3>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {frontendSkills.map(function (skill) {
                return (
                  <div
                    key={skill.name}
                    className="bg-white dark:bg-gray-900 p-4 rounded-3xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-110 w-32 h-32"
                  >
                    {/* Icon */}
                    <div className="mb-3">{getSkillIcon(skill.name)}</div>

                    {/* Skill Name */}
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-base text-center">
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
          <h3 className="text-card-md font-heading font-semibold text-light-text-primary dark:text-white mb-6 text-center">
            Tools & Workflow
          </h3>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6">
              {toolsSkills.map(function (skill) {
                return (
                  <div
                    key={skill.name}
                    className="bg-white dark:bg-gray-900 p-4 rounded-3xl flex flex-col items-center justify-center hover:shadow-lg transition-all hover:scale-110 w-32 h-32"
                  >
                    {/* Icon */}
                    <div className="mb-3">{getSkillIcon(skill.name)}</div>

                    {/* Skill Name */}
                    <p className="font-heading font-semibold text-light-text-primary dark:text-white text-base text-center">
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