import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { projects } from '../../data/projects'
import { prefersReducedMotion } from '../../lib/motion'
import ProjectSlide from '../ui/ProjectSlide'

// Same query as the `pin` screen in tailwind.config.js
const PIN_QUERY =
  '(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)'

const total = projects.length
// Extra scroll, in screens, during which the first and last slides stay put before the section
// releases, so the pin doesn't let go the instant you reach either end
const HOLD = 0.8
// How far past a slide (as a share of the gap to the next) a scroll must go to snap onward
const SNAP_ONWARD = 0.1

// Pinned mode: the section is one screen tall per slide, and a full-screen frame sticks to the top
// while native vertical scrolling slides the row sideways. Nothing intercepts the wheel, so the
// scrollbar, keyboard and anchors keep working. Narrow, short or reduced-motion screens stack the
// slides instead.
function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(function () {
    const section = sectionRef.current
    const track = trackRef.current
    const bar = barRef.current
    if (!section || !track || !bar) return
    const pin = window.matchMedia(PIN_QUERY)
    let frame = 0

    // Scroll length over which the slides actually move, after the hold at each end
    function travel() {
      const hold = HOLD * window.innerHeight
      return { hold, length: section!.offsetHeight - window.innerHeight - 2 * hold }
    }

    // Page offset at which slide `i` is fully in view
    function slideTop(i: number) {
      const top = section!.getBoundingClientRect().top + window.scrollY
      const { hold, length } = travel()
      return top + hold + (length * i) / Math.max(total - 1, 1)
    }

    function update() {
      frame = 0
      if (!pin.matches) {
        track!.style.transform = ''
        bar!.style.transform = ''
        return
      }
      const { hold, length } = travel()
      const scrolled = -section!.getBoundingClientRect().top - hold
      const progress = Math.min(Math.max(scrolled / length, 0), 1)
      const shift = track!.scrollWidth - track!.clientWidth
      track!.style.transform = `translate3d(${-Math.round(progress * shift)}px, 0, 0)`
      bar!.style.transform = `scaleX(${progress})`
      setCurrent(Math.round(progress * (total - 1)))
    }
    let lastY = window.scrollY
    let direction = 0
    let settle: ReturnType<typeof setTimeout> | undefined
    const hasScrollEnd = 'onscrollend' in window
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
      if (window.scrollY !== lastY) direction = Math.sign(window.scrollY - lastY)
      lastY = window.scrollY
      // Any new scroll cancels a pending snap. Browsers without scrollend wait for a pause instead.
      clearTimeout(settle)
      if (!hasScrollEnd) settle = setTimeout(snap, 200)
    }
    // scrollend also fires between mouse-wheel notches, so give the next notch a moment to land
    function onScrollEnd() {
      clearTimeout(settle)
      settle = setTimeout(snap, 150)
    }

    // Once scrolling stops between two slides, glide to one: onward if the scroll went more than
    // SNAP_ONWARD of the way, else back. The holds at either end never snap, so leaving stays free.
    function snap() {
      if (!pin.matches) return
      const { hold, length } = travel()
      const scrolled = -section!.getBoundingClientRect().top - hold
      if (scrolled <= 1 || scrolled >= length - 1) return
      const position = (scrolled / length) * (total - 1)
      const from = Math.floor(position)
      const part = position - from
      if (part < 0.01 || part > 0.99) return
      const target =
        direction >= 0
          ? part > SNAP_ONWARD
            ? from + 1
            : from
          : part < 1 - SNAP_ONWARD
            ? from
            : from + 1
      goTo(target, true)
    }

    function slideIndex(id: string) {
      return projects.findIndex(project => `project-${project.id}` === id)
    }
    function goTo(i: number, smooth: boolean) {
      window.scrollTo({
        top: slideTop(i),
        behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto',
      })
    }

    // A moved slide can't be an anchor target, so links to #project-<id> scroll the page instead
    function onClick(event: MouseEvent) {
      if (!pin.matches) return
      const link = (event.target as Element).closest?.('a[href^="#project-"]')
      const i = link ? slideIndex(link.getAttribute('href')!.slice(1)) : -1
      if (i < 0) return
      event.preventDefault()
      history.pushState(null, '', `#project-${projects[i].id}`)
      goTo(i, true)
    }

    // Tabbing to a link on another slide brings that slide into place
    function onFocusIn(event: FocusEvent) {
      if (!pin.matches) return
      const slide = (event.target as Element).closest('article[id^="project-"]')
      if (slide) goTo(slideIndex(slide.id), false)
    }

    update()
    if (pin.matches && location.hash.startsWith('#project-')) {
      const i = slideIndex(location.hash.slice(1))
      if (i >= 0) goTo(i, false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('resize', onScroll)
    pin.addEventListener('change', onScroll)
    document.addEventListener('click', onClick)
    track.addEventListener('focusin', onFocusIn)

    return function () {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      clearTimeout(settle)
      window.removeEventListener('resize', onScroll)
      pin.removeEventListener('change', onScroll)
      document.removeEventListener('click', onClick)
      track.removeEventListener('focusin', onFocusIn)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ '--slides': total, '--hold': HOLD } as CSSProperties}
      className="relative py-24 pin:py-0 pin:h-[calc((var(--slides)+2*var(--hold))*100svh)]"
    >
      <div className="pin:sticky pin:top-0 pin:h-[100svh] pin:flex pin:flex-col pin:[overflow:clip]">
        <div className="max-w-7xl w-full mx-auto px-6 pin:pt-24 pin:short:pt-20 mb-12 pin:mb-0">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-title pin:short:text-[2.5rem] font-bold text-ink">Selected work</h2>
            <p
              aria-hidden="true"
              className="hidden pin:block text-lead font-semibold text-ink tabular-nums"
            >
              {String(current + 1).padStart(2, '0')}
              <span className="text-muted"> / {String(total).padStart(2, '0')}</span>
            </p>
          </div>
          <div aria-hidden="true" className="hidden pin:block mt-4 h-0.5 bg-surface">
            <div ref={barRef} className="h-full bg-accent origin-left scale-x-0" />
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col gap-24 pin:gap-0 pin:flex-row pin:flex-1 pin:min-h-0 will-change-transform"
        >
          {projects.map(function (project, index) {
            return <ProjectSlide key={project.id} project={project} index={index} total={total} />
          })}
        </div>
      </div>
    </section>
  )
}

export default Projects
