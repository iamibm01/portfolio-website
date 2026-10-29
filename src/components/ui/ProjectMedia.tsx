import type { Project } from '../../types'
import { prefersReducedMotion } from '../../lib/motion'

interface ProjectMediaProps {
  project: Project
  eager?: boolean // the first card is on screen at load
}

// 16:10 frame: a looping screen recording when the project has one, else the still
function ProjectMedia({ project, eager = false }: ProjectMediaProps) {
  const name = project.title.split(' — ')[0]

  return (
    <div className="aspect-[16/10] overflow-hidden bg-field">
      {project.video ? (
        <video
          className="w-full h-full object-cover"
          src={project.video}
          poster={project.image}
          muted
          loop
          playsInline
          autoPlay={!prefersReducedMotion()}
          preload="metadata"
          aria-label={`${name} screen recording`}
        />
      ) : (
        <img
          className="w-full h-full object-cover"
          src={project.image}
          alt={`${name} preview`}
          width={1600}
          height={1000}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  )
}

export default ProjectMedia
