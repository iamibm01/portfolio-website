import type { ComponentType } from 'react'
import {
  SiAnthropic,
  SiOpenai,
  SiTypescript,
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiPrisma,
  SiAmazonwebservices,
  SiDocker,
  SiGit,
  SiN8N,
} from 'react-icons/si'
import { FileSearch, Bot, MessageSquareText, Webhook } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { skills } from '../../data/skills'

type IconProps = { className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }

// Lucide icons are outlines; a 1.75 stroke sits closer in weight to the filled brand logos
function outline(Icon: LucideIcon): ComponentType<IconProps> {
  return function OutlineIcon(props: IconProps) {
    return <Icon strokeWidth={1.75} {...props} />
  }
}

const ICONS: Record<string, ComponentType<IconProps>> = {
  anthropic: SiAnthropic,
  openai: SiOpenai,
  rag: outline(FileSearch),
  agents: outline(Bot),
  prompts: outline(MessageSquareText),
  typescript: SiTypescript,
  'next.js': SiNextdotjs,
  react: SiReact,
  node: SiNodedotjs,
  nestjs: SiNestjs,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  restapi: outline(Webhook),
  aws: SiAmazonwebservices,
  docker: SiDocker,
  git: SiGit,
  n8n: SiN8N,
}

// Fades the names in and out at both ends of the band
const EDGE_FADE =
  'motion-safe:[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]'

function SkillList({ hidden = false }: { hidden?: boolean }) {
  return (
    // pr matches the gap so the two copies join seamlessly at the -50% loop point
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center gap-x-16 gap-y-10 motion-safe:pr-16 motion-reduce:shrink motion-reduce:flex-wrap ${hidden ? 'motion-reduce:hidden' : ''}`}
    >
      {skills.map(function (skill) {
        const Icon = skill.icon ? ICONS[skill.icon] : undefined
        return (
          <li key={skill.name} className="flex flex-col items-center gap-3 whitespace-nowrap">
            {Icon && <Icon aria-hidden="true" className="w-10 h-10 md:w-12 md:h-12 text-accent" />}
            <span className="text-base font-semibold leading-none text-accent">{skill.name}</span>
          </li>
        )
      })}
    </ul>
  )
}

// A full-width strip on the page background. Two copies of the list slide left by half their
// width, so the loop never shows a seam. Hover pauses it. Under reduced motion it is a static,
// wrapped list.
function SkillsMarquee() {
  return (
    <div className="relative py-6 md:py-7">
      <h3 className="sr-only">What I work with</h3>

      <div className={`overflow-hidden py-1 ${EDGE_FADE}`}>
        <div className="flex motion-safe:w-max motion-safe:animate-marquee hover:[animation-play-state:paused] motion-reduce:max-w-7xl motion-reduce:mx-auto motion-reduce:px-6">
          <SkillList />
          <SkillList hidden />
        </div>
      </div>
    </div>
  )
}

export default SkillsMarquee
