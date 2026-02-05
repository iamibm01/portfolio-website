import { useEffect, useRef, useState } from 'react'
// import Navbar from './components/layout/Navbar'
import PillNavbar from './components/layout/PillNavbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'

function App() {
  const mainRef = useRef<HTMLElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const isScrolling = useRef(false)

  useEffect(function () {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact']
    const mainElement = mainRef.current
    if (!mainElement) return

    const scrollToSection = function (index: number) {
      if (index < 0 || index >= sections.length) return
      if (isScrolling.current) return

      isScrolling.current = true
      setCurrentSection(index)

      const targetSection = document.getElementById(sections[index])
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' })
      }

      // Allow next scroll after animation completes
      setTimeout(function () {
        isScrolling.current = false
      }, 800)
    }

    const handleWheel = function (e: WheelEvent) {
      e.preventDefault()

      if (isScrolling.current) return

      if (e.deltaY > 0) {
        // Scroll down
        scrollToSection(currentSection + 1)
      } else if (e.deltaY < 0) {
        // Scroll up
        scrollToSection(currentSection - 1)
      }
    }

    // Touch handling for mobile
    let touchStartY = 0

    const handleTouchStart = function (e: TouchEvent) {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = function (e: TouchEvent) {
      if (isScrolling.current) return

      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up - scroll down
          scrollToSection(currentSection + 1)
        } else {
          // Swipe down - scroll up
          scrollToSection(currentSection - 1)
        }
      }
    }

    // Keyboard navigation
    const handleKeyDown = function (e: KeyboardEvent) {
      if (isScrolling.current) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        scrollToSection(currentSection + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        scrollToSection(currentSection - 1)
      }
    }

    mainElement.addEventListener('wheel', handleWheel, { passive: false })
    mainElement.addEventListener('touchstart', handleTouchStart, { passive: true })
    mainElement.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return function () {
      mainElement.removeEventListener('wheel', handleWheel)
      mainElement.removeEventListener('touchstart', handleTouchStart)
      mainElement.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSection])

  return (
    <div className="min-h-screen bg-light-bg">
      {/* <Navbar /> */}
      <PillNavbar />

      <main ref={mainRef} className="h-screen overflow-hidden">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </div>
  )
}

export default App