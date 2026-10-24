// Read at call time so imperative code (gsap tweens, canvas loops)
// follows the OS setting even if it changes after load.
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
