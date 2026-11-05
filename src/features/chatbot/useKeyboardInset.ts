import { useEffect, type RefObject } from 'react'

// Publishes the on-screen keyboard's height as --keyboard-height on the given element.
// The viewport meta uses interactive-widget=resizes-visual, so the layout viewport stays put when
// the keyboard opens and visualViewport shrinks instead; the gap between them is the keyboard.
// It writes a CSS variable straight to the DOM, with no React state, so typing never re-renders.
// When the browser pans to the focused input by itself the offset is 0 and nothing moves.
export function useKeyboardInset(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      ref.current?.style.setProperty('--keyboard-height', `${offset}px`)
    }

    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [ref])
}
