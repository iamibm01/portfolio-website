import { useEffect, useRef, useState } from 'react'
import type { Project } from '../../types'
import { prefersReducedMotion } from '../../lib/motion'

export interface ProjectCardMedia {
  type: 'image' | 'video'
  src: string
  poster?: string // video only; also what reduced motion shows instead of the video
  alt: string
}

export interface ProjectCardProps extends Pick<Project, 'title' | 'description'> {
  media: ProjectCardMedia
  href?: string
}

// "Caption plate": full-bleed media with one solid plate at the foot, so the text reads on any screenshot.
// The plate sits in flow, not absolute, so a long description grows the card instead of being cut off;
// the media rounds its own corners, which lets the card drop overflow-hidden and keeps the pulse unclipped.
// The plate follows the theme through the colour tokens; only the media backdrop stays dark.
function ProjectCard({ title, description, media, href = '#projects' }: ProjectCardProps) {
  const stillOnly = media.type === 'video' && media.poster && prefersReducedMotion()
  const mediaClass = 'absolute inset-0 w-full h-full object-cover rounded-[20px]'
  const cardRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // The button only pulses on the card in view; the observer accounts for the carousel's clipping,
  // so a peeking card or one scrolled off the page stays quiet
  useEffect(function () {
    const card = cardRef.current
    if (!card) return
    const observer = new IntersectionObserver(
      function ([entry]) {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.6 }
    )
    observer.observe(card)
    return function () {
      observer.disconnect()
    }
  }, [])

  return (
    <article
      ref={cardRef}
      className="relative w-full max-w-[560px] aspect-[6/7] flex flex-col justify-end p-4 pt-24 rounded-[20px] bg-field"
    >
      {media.type === 'video' && !stillOnly ? (
        <video
          className={mediaClass}
          src={media.src}
          poster={media.poster}
          autoPlay={!prefersReducedMotion()}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        />
      ) : (
        <img
          className={mediaClass}
          src={stillOnly ? media.poster : media.src}
          alt={media.alt}
          loading="lazy"
          decoding="async"
        />
      )}

      <div className="relative flex flex-col items-start gap-1.5 rounded-2xl bg-surface px-5 pt-[18px] pb-5 sm:px-6 sm:pt-[22px] sm:pb-6">
        <h3 className="text-[clamp(1.5rem,1.1rem+1.6vw,1.875rem)] font-bold leading-[1.12] text-ink">
          {title}
        </h3>
        <p className="text-[15px] leading-[1.5] text-muted text-pretty">{description}</p>

        {/* mt-2 plus the 6px gap gives 14px */}
        <a
          href={href}
          className={`mt-2 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-accent text-[15px] font-bold text-on-accent focus-visible:outline-ink focus-visible:outline-offset-4 hover:animate-none focus-visible:animate-none ${inView ? 'motion-safe:animate-cta-pulse' : ''}`}
        >
          Learn more<span className="sr-only"> about {title}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default ProjectCard
