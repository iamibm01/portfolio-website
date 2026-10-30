import { useEffect, useRef, useState } from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import { projects } from '../../data/projects'
import { prefersReducedMotion } from '../../lib/motion'
import ProjectCard from './ProjectCard'

// Card width and the trailing spacer share these sizes so the last card can snap to the start
const CARD_WIDTH = 'w-[min(34rem,85%)] lg:w-[min(34rem,80%)]'
const SPACER_WIDTH =
  'w-[calc(100%_-_min(34rem,85%)_-_1.5rem)] lg:w-[calc(100%_-_min(34rem,80%)_-_1.5rem)]'
// Opaque through the current card and gap, then fades out across the peeking card
const PEEK_FADE =
  '[mask-image:linear-gradient(to_right,#000_calc(min(34rem,85%)_+_1.5rem),transparent)] lg:[mask-image:linear-gradient(to_right,#000_calc(min(34rem,80%)_+_1.5rem),transparent)]'

const controlClass =
  'w-11 h-11 inline-flex items-center justify-center rounded-full bg-surface text-ink hover:bg-accent hover:text-on-accent transition-colors disabled:opacity-40 disabled:pointer-events-none'

function ProjectCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Native scroll does the moving; this only keeps the buttons' disabled state in sync
  useEffect(function () {
    const track = trackRef.current
    if (!track) return
    let frame = 0

    function update() {
      frame = 0
      setAtStart(track!.scrollLeft <= 1)
      setAtEnd(track!.scrollLeft + track!.clientWidth >= track!.scrollWidth - 1)
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    track.addEventListener('scroll', onScroll, { passive: true })
    const sizes = new ResizeObserver(update)
    sizes.observe(track)

    return function () {
      track.removeEventListener('scroll', onScroll)
      sizes.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  function step(direction: 1 | -1) {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('[aria-roledescription="slide"]')
    if (!track || !card) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <section aria-roledescription="carousel" aria-label="Featured projects">
      <h2 className="sr-only">Featured projects</h2>

      <div
        ref={trackRef}
        className={`flex gap-6 overflow-x-auto snap-x snap-mandatory py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${PEEK_FADE}`}
      >
        {projects.map(function (project, index) {
          const name = project.title.split(' — ')[0]

          return (
            <div
              key={project.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${projects.length}: ${name}`}
              className={`${CARD_WIDTH} shrink-0 snap-start`}
            >
              <ProjectCard
                title={name}
                description={project.description}
                href={`#project-${project.id}`}
                media={{
                  type: project.video ? 'video' : 'image',
                  src: project.video ?? project.image,
                  poster: project.image,
                  alt: `${name} preview`,
                }}
              />
            </div>
          )
        })}
        <div aria-hidden="true" className={`${SPACER_WIDTH} shrink-0`} />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label="Previous project"
          className={controlClass}
        >
          <HiArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label="Next project"
          className={controlClass}
        >
          <HiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}

export default ProjectCarousel
