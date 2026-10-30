import type { Project } from '../../types'
import { prefersReducedMotion } from '../../lib/motion'

interface ProjectMediaProps {
  project: Project
  eager?: boolean // the first card is on screen at load
}

// 16:10 frame: a looping screen recording when the project has one, else the 16:10 screenshot
// (falling back to the card art)
function ProjectMedia({ project, eager = false }: ProjectMediaProps) {
  const name = project.title.split(' — ')[0]
  const still = project.screenshot ?? project.image

  return (
    <div className="aspect-[16/10] overflow-hidden bg-field">
      {project.video ? (
        <video
          className="w-full h-full object-cover"
          src={project.video}
          poster={still}
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
          src={still}
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
