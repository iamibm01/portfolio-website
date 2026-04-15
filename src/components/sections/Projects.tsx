import { projects } from '../../data/projects'
import { motion } from 'framer-motion'
import SectionDivider from '../ui/SectionDivider'
import {
  FaReact,
  FaNodeJs,
  FaGithub,
  FaHtml5,
  FaCss3Alt,
  FaJs,
} from 'react-icons/fa'
import {
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiPostgresql,
  SiExpress,
  SiPrisma,
} from 'react-icons/si'
import { TbApi, TbCloud } from 'react-icons/tb'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

// Map tech name → icon component + brand color
const TECH_META: Record<string, { icon: React.ReactNode; color: string }> = {
  React:           { icon: <FaReact />,        color: '#61dafb' },
  TypeScript:      { icon: <SiTypescript />,   color: '#3178c6' },
  'Tailwind CSS':  { icon: <SiTailwindcss />,  color: '#06b6d4' },
  JavaScript:      { icon: <FaJs />,           color: '#f7df1e' },
  'Node.js':       { icon: <FaNodeJs />,       color: '#68a063' },
  'Next.js':       { icon: <SiNextdotjs />,    color: '#ffffff' },
  PostgreSQL:      { icon: <SiPostgresql />,   color: '#336791' },
  Express:         { icon: <SiExpress />,      color: '#ffffff' },
  Prisma:          { icon: <SiPrisma />,       color: '#5a67d8' },
  'REST API':      { icon: <TbApi />,          color: '#f97316' },
  HTML:            { icon: <FaHtml5 />,        color: '#e34f26' },
  CSS:             { icon: <FaCss3Alt />,      color: '#1572b6' },
  GitHub:          { icon: <FaGithub />,       color: '#ffffff' },
}

function getFallbackIcon(name: string) {
  if (name.toLowerCase().includes('api') || name.toLowerCase().includes('weather'))
    return { icon: <TbCloud />, color: '#94a3b8' }
  return { icon: <TbApi />, color: '#94a3b8' }
}

// Gradient palettes keyed to the first matching tech
const PALETTE_MAP: Record<string, [string, string]> = {
  React:          ['#0f172a', '#0ea5e922'],
  TypeScript:     ['#0f172a', '#3b82f622'],
  'Tailwind CSS': ['#0c1a26', '#06b6d422'],
  JavaScript:     ['#1c1400', '#f59e0b22'],
  'Node.js':      ['#0a1a0a', '#22c55e22'],
  'Next.js':      ['#0a0a0a', '#71717a22'],
  PostgreSQL:     ['#0a0f1e', '#3b82f622'],
}

function getGradient(technologies: string[]): string {
  for (const tech of technologies) {
    const pair = PALETTE_MAP[tech]
    if (pair) return `linear-gradient(135deg, ${pair[0]} 0%, ${pair[1]} 100%)`
  }
  return 'linear-gradient(135deg, #0f172a 0%, #f9731622 100%)'
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  completed:   { label: 'Completed',   color: '#22c55e' },
  'in-progress': { label: 'In Progress', color: '#f59e0b' },
  planned:     { label: 'Planned',     color: '#94a3b8' },
}

interface ProjectPlaceholderProps {
  title: string
  technologies: string[]
  status: string
}

function ProjectPlaceholder({ title, technologies, status }: ProjectPlaceholderProps) {
  const gradient = getGradient(technologies)
  const statusMeta = STATUS_LABEL[status] ?? { label: status, color: '#94a3b8' }

  return (
    <div
      className="w-full h-52 relative overflow-hidden select-none"
      style={{ background: gradient }}
    >
      {/* Subtle dot texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Browser chrome bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/30 backdrop-blur-sm flex items-center px-3 gap-2 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        <div className="ml-2 flex-1 h-4 bg-white/10 rounded-full flex items-center px-2.5">
          <span className="text-white/40 text-[9px] font-mono tracking-wide truncate">
            {title.toLowerCase().replace(/\s+/g, '-')}.vercel.app
          </span>
        </div>
      </div>

      {/* Status badge */}
      <div className="absolute top-10 right-3">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm"
          style={{
            background: `${statusMeta.color}22`,
            color: statusMeta.color,
            border: `1px solid ${statusMeta.color}44`,
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: statusMeta.color }}
          />
          {statusMeta.label}
        </span>
      </div>

      {/* Tech icons — floating pills */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pt-4">
        <div className="flex items-center gap-2 flex-wrap justify-center px-6">
          {technologies.slice(0, 4).map((tech) => {
            const meta = TECH_META[tech] ?? getFallbackIcon(tech)
            return (
              <div
                key={tech}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm text-xs font-medium"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: meta.color,
                }}
              >
                <span className="text-sm">{meta.icon}</span>
                <span className="text-white/70">{tech}</span>
              </div>
            )
          })}
        </div>

        {/* Project title — large ghost text */}
        <p
          className="text-white/10 font-heading font-bold text-2xl tracking-tight text-center px-4 leading-tight"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.05)' }}
        >
          {title}
        </p>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <section
      id="projects"
      className="snap-start min-h-screen flex items-center bg-white dark:bg-gray-900 py-20 pb-28 relative overflow-hidden"
    >
      {/* Large sparse amber dots */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f59e0b 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Divider → Experience (light-bg / gray-800) */}
      <SectionDivider lightFill="#FFF8F3" darkFill="#1f2937" direction="left" />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-section-md font-heading font-semibold text-light-text-primary dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-body-lg text-light-text-secondary dark:text-gray-400">
            A selection of my recent work
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map(function (project, index) {
            return (
              <motion.div
                key={project.id}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
                className="bg-white/30 dark:bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:shadow-xl transition-shadow border border-white/40 dark:border-white/15"
              >
                <ProjectPlaceholder
                  title={project.title}
                  technologies={project.technologies}
                  status={project.status}
                />

                <div className="p-6 space-y-4">
                  <h3 className="font-heading font-semibold text-light-text-primary dark:text-white text-xl">
                    {project.title}
                  </h3>

                  <p className="text-body-base text-light-text-secondary dark:text-gray-400">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(function (tech) {
                      return (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/40 dark:bg-white/10 backdrop-blur-md text-primary dark:text-primary-light text-sm font-medium rounded-full border border-white/30 dark:border-white/10"
                        >
                          {tech}
                        </span>
                      )
                    })}
                  </div>

                  <div className="flex gap-4 pt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-primary dark:bg-primary-light text-white font-medium rounded-full hover:bg-primary-dark dark:hover:bg-primary transition-colors"
                      >
                        View Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border-2 border-primary dark:border-primary-light text-primary dark:text-primary-light font-medium rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-white transition-all"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Projects
