import { useEffect, useRef } from 'react'

export function useScrollSnap() {
  const scrollContainerRef = useRef<HTMLElement>(null)
  const isScrollingRef = useRef(false)

  useEffect(function () {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = function (e: WheelEvent) {
      // Prevent default scroll
      e.preventDefault()

      // If already scrolling, ignore
      if (isScrollingRef.current) return

      // Set scrolling flag
      isScrollingRef.current = true

      // Determine direction
      const direction = e.deltaY > 0 ? 1 : -1

      // Get all sections
      const sections = container.querySelectorAll('section')
      const currentScroll = container.scrollTop

      // Find current section
      let currentIndex = 0
      sections.forEach(function (section, index) {
        const rect = section.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        if (rect.top <= containerRect.top + 100) {
          currentIndex = index
        }
      })

      // Calculate next section
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))
      const targetSection = sections[nextIndex]

      // Scroll to target section
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      // Reset scrolling flag after animation
      setTimeout(function () {
        isScrollingRef.current = false
      }, 10)
    }

    // Add wheel event listener
    container.addEventListener('wheel', handleWheel, { passive: false })

    // Cleanup
    return function () {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return scrollContainerRef
}
