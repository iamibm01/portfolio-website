import { HiMiniArrowUpRight } from 'react-icons/hi2'
import type { Project } from '../../types'
import ProjectMedia from './ProjectMedia'

const STATUS_LABEL: Record<Project['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  planned: 'Planned',
}

interface ProjectSlideProps {
  project: Project
  index: number
  total: number
}

const linkClass =
  'inline-flex items-center min-h-11 font-semibold text-accent hover:underline underline-offset-4'

// One project: the screenshot on the left, the write-up on the right. Full screen when Projects
// is pinned (`pin:`), a plain stacked block otherwise.
function ProjectSlide({ project, index, total }: ProjectSlideProps) {
  const [name, kind] = project.title.split(' — ')
  const meta = [kind, STATUS_LABEL[project.status]].filter(Boolean).join(' · ')
  const notes = [
    { heading: 'The problem', text: project.problem },
    { heading: 'What I built', text: project.built },
    { heading: 'The result', text: project.result },
  ].filter(note => note.text)

  return (
    <article
      id={`project-${project.id}`}
      aria-label={`${index + 1} of ${total}: ${name}`}
      className="pin:w-full pin:shrink-0 pin:h-full flex items-center"
    >
      <div className="max-w-7xl w-full mx-auto px-6 grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-7 overflow-hidden rounded-[20px]">
          <ProjectMedia project={project} eager={index === 0} />
        </div>

        <div className="lg:col-span-5 space-y-5 pin:short:space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted">{meta}</p>
            <h3 className="text-[clamp(2rem,1.2rem+1.6vw,3rem)] pin:short:text-[2rem] font-bold leading-[1.05] tracking-tight text-accent">
              {name}
            </h3>
          </div>

          {notes.map(function (note) {
            return (
              <div key={note.heading} className="space-y-1">
                <h4 className="text-sm font-semibold text-ink">{note.heading}</h4>
                <p className="text-base pin:short:text-[1rem] text-ink text-pretty">{note.text}</p>
              </div>
            )
          })}

          <p className="text-sm text-muted">{project.technologies.join(' · ')}</p>

          {(project.liveUrl || project.githubUrl) && (
            <div className="flex gap-6">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live site: ${name}`}
                  className={linkClass}
                >
                  Live <HiMiniArrowUpRight aria-hidden="true" className="w-4 h-4 ml-1" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Code for ${name}`}
                  className={linkClass}
                >
                  Code <HiMiniArrowUpRight aria-hidden="true" className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectSlide
