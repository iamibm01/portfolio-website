import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { NAV_ITEMS } from '../../data/constants'
import { useTheme } from '../../context/useTheme'

function PillNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [showBackground, setShowBackground] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const navItemsRef = useRef<HTMLDivElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement | null>(null)
  const navWrapperRef = useRef<HTMLDivElement | null>(null)

  const ease = 'power3.easeOut'

  // Theme-based colors
  const baseColor = isDarkMode ? '#1A1A1A' : '#FFFFFF'
  const pillColor = isDarkMode ? '#FF8C42' : '#FF6B35'
  const pillTextColor = isDarkMode ? '#FFFFFF' : '#FFFFFF'

  // Smooth scroll handler
  const handleNavClick = function (e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Initial load animation
  useEffect(function () {
    const menu = mobileMenuRef.current
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, y: 0 })
    }

    const navItems = navItemsRef.current

    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' })
      gsap.to(navItems, { width: 'auto', duration: 0.6, ease })
    }
  }, [])

  // Track active section and show/hide background
  useEffect(function () {
    const scrollRoot = document.querySelector('main')
    const observerOptions = {
      root: scrollRoot,
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    }

    const observerCallback = function (entries: IntersectionObserverEntry[]) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          setActiveSection(sectionId)

          // Show background only if NOT on hero section
          const shouldShowBg = sectionId !== 'hero'
          setShowBackground(shouldShowBg)

          const bg = backgroundRef.current
          if (bg) {
            if (shouldShowBg) {
              gsap.to(bg, {
                opacity: 1,
                duration: 0.4,
                ease,
              })
            } else {
              gsap.to(bg, {
                opacity: 0,
                duration: 0.4,
                ease,
              })
            }
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll('section[id]')
    sections.forEach(function (section) {
      observer.observe(section)
    })

    return function () {
      sections.forEach(function (section) {
        observer.unobserve(section)
      })
    }
  }, [])

  const closeMobileMenu = function () {
    setIsMobileMenuOpen(false)

    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line')
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease })
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease })
    }

    if (menu) {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease,
        onComplete: function () {
          gsap.set(menu, { visibility: 'hidden' })
        },
      })
    }
  }

  // Close mobile menu when tapping outside the nav wrapper
  useEffect(function () {
    if (!isMobileMenuOpen) return

    function handleOutsideClick(e: MouseEvent | TouchEvent) {
      if (navWrapperRef.current && !navWrapperRef.current.contains(e.target as Node)) {
        closeMobileMenu()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return function () {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = function () {
    if (isMobileMenuOpen) {
      closeMobileMenu()
      return
    }

    setIsMobileMenuOpen(true)

    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line')
      gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease })
      gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease })
    }

    if (menu) {
      gsap.set(menu, { visibility: 'visible' })
      gsap.fromTo(menu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease })
    }
  }

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--pill-text': pillTextColor,
    '--nav-h': '48px',
    '--pill-pad-x': '20px',
    '--pill-gap': '4px',
  } as React.CSSProperties

  return (
    <>
      {/* Mobile dark mode toggle — fixed top-right corner */}
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="md:hidden fixed top-6 right-4 z-[60] flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
        style={{ color: pillColor }}
      >
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      {/* Full-width glass background - only visible outside hero */}
      <div
        ref={backgroundRef}
        className="fixed top-0 left-0 right-0 z-40 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 opacity-0"
      />

      {/* Navbar content */}
      <div ref={navWrapperRef} className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav
          className="flex items-center justify-between md:justify-start gap-2"
          aria-label="Primary"
          style={cssVars}
        >

          {/* Desktop Nav Items */}
          <div
            ref={navItemsRef}
            className="relative items-center rounded-full hidden md:flex"
            style={{
              height: 'var(--nav-h)',
              //   background: showBackground ? 'var(--base)' : 'transparent',
            }}
          >
            <ul role="menubar" className="list-none flex items-stretch m-0 p-[3px] h-full gap-1">
              {NAV_ITEMS.map(function (item) {
                const isActive = activeSection === item.href.substring(1)

                return (
                  <li key={item.href} role="none" className="flex h-full">
                    <a
                      role="menuitem"
                      href={item.href}
                      onClick={function (e) {
                        handleNavClick(e, item.href)
                      }}
                      className="relative inline-flex flex-col items-center justify-center h-full no-underline rounded-full box-border font-semibold text-sm uppercase tracking-wide whitespace-nowrap cursor-pointer transition-all duration-300 gap-0.5"
                      style={{
                        background: isActive ? pillColor : 'transparent',
                        color: isActive ? pillTextColor : pillColor,
                        paddingLeft: 'var(--pill-pad-x)',
                        paddingRight: 'var(--pill-pad-x)',
                        border: 'none',
                        outline: 'none',
                        boxShadow: isActive
                          ? `0 0 0 2px ${pillColor}40, 0 4px 12px ${pillColor}50`
                          : 'none',
                      }}
                      onMouseEnter={function (e) {
                        if (!isActive) {
                          e.currentTarget.style.background = pillColor + '22'
                          e.currentTarget.style.color = pillColor
                        }
                      }}
                      onMouseLeave={function (e) {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = pillColor
                        }
                      }}
                    >
                      {item.label}
                      {isActive && (
                        <span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                          style={{ background: pillColor }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}

              {/* Dark Mode Toggle */}
              <li role="none" className="flex h-full">
                <button
                  onClick={toggleDarkMode}
                  className="relative inline-flex items-center justify-center h-full rounded-full box-border cursor-pointer px-4 transition-all duration-300"
                  style={{
                    background: 'transparent',
                    color: pillColor,
                    border: 'none',
                    outline: 'none',
                  }}
                  onMouseEnter={function (e) {
                    e.currentTarget.style.background = pillColor
                    e.currentTarget.style.color = pillTextColor
                  }}
                  onMouseLeave={function (e) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = pillColor
                  }}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden rounded-full flex flex-col items-center justify-center gap-1 cursor-pointer p-0"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: showBackground ? 'var(--base)' : 'transparent',
              border: showBackground ? 'none' : `2px solid ${pillColor}`,
            }}
          >
            <span className="hamburger-line w-4 h-0.5 rounded" style={{ background: pillColor }} />
            <span className="hamburger-line w-4 h-0.5 rounded" style={{ background: pillColor }} />
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-16 left-4 right-4 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/30 dark:border-white/10"
          style={{
            background: isDarkMode ? 'rgba(17,24,39,0.5)' : 'rgba(255,255,255,0.5)',
            ...cssVars,
          }}
        >
          <ul className="list-none m-0 p-3 flex flex-col gap-1">
            {NAV_ITEMS.map(function (item) {
              const isActive = activeSection === item.href.substring(1)

              return (
                <li key={item.href} className="flex justify-center">
                  <a
                    href={item.href}
                    onClick={function (e) {
                      handleNavClick(e, item.href)
                      setTimeout(closeMobileMenu, 150)
                    }}
                    className="inline-flex items-center py-2.5 px-6 text-base font-semibold rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? pillColor : 'transparent',
                      color: isActive ? pillTextColor : pillColor,
                    }}
                    onMouseEnter={function (e) {
                      if (!isActive) {
                        e.currentTarget.style.background = pillColor + '22'
                      }
                    }}
                    onMouseLeave={function (e) {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export default PillNavbar
