// Read at call time so imperative code (gsap, scrollTo, canvas loops)
// follows the OS setting even if it changes after load.
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollBehavior(): 'auto' | 'smooth' {
  return prefersReducedMotion() ? 'auto' : 'smooth'
}
