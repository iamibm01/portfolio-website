import { useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion'

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
  animationSpeed?: number
  showBorder?: boolean
  direction?: 'horizontal' | 'vertical' | 'diagonal'
  pauseOnHover?: boolean
  yoyo?: boolean
}

export default function GradientText({
  children,
  className = '',
  colors = ['#FF6B35', '#F7931E', '#06B6D4', '#3B82F6'],
  animationSpeed = 100,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = false,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false)
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const animationDuration = animationSpeed * 1000

  useAnimationFrame(function (time) {
    if (isPaused) {
      lastTimeRef.current = null
      return
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }
    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    elapsedRef.current += deltaTime

    if (yoyo) {
      const fullCycle = animationDuration * 2
      const cycleTime = elapsedRef.current % fullCycle
      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100)
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100)
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100)
    }
  })

  useEffect(
    function () {
      elapsedRef.current = 0
      progress.set(0)
    },
    [animationSpeed, yoyo, progress]
  )

  const backgroundPosition = useTransform(progress, function (p) {
    if (direction === 'horizontal') {
      return `${p}% 50%`
    } else if (direction === 'vertical') {
      return `50% ${p}%`
    } else {
      return `${p}% 50%`
    }
  })

  const handleMouseEnter = useCallback(
    function () {
      if (pauseOnHover) setIsPaused(true)
    },
    [pauseOnHover]
  )

  const handleMouseLeave = useCallback(
    function () {
      if (pauseOnHover) setIsPaused(false)
    },
    [pauseOnHover]
  )

  const gradientAngle =
    direction === 'horizontal'
      ? 'to right'
      : direction === 'vertical'
        ? 'to bottom'
        : 'to bottom right'
  const gradientColors = [...colors, colors[0]].join(', ')

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === 'horizontal'
        ? '300% 100%'
        : direction === 'vertical'
          ? '100% 300%'
          : '300% 300%',
    backgroundRepeat: 'repeat',
  }

  return (
    <motion.div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center font-medium transition-shadow duration-500 overflow-visible ${showBorder ? 'py-1 px-2 rounded-[1.25rem] backdrop-blur' : ''} ${className}`}
      style={{
        backgroundColor: 'transparent',
        background: 'transparent',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showBorder && (
        <motion.div
          className="inline-block relative z-2 text-transparent bg-clip-text"
          style={{
            ...gradientStyle,
            backgroundPosition,
            WebkitBackgroundClip: 'text',
            backgroundColor: 'transparent',
          }}
        >
          <div
            className="absolute bg-black rounded-[1.25rem] z-[-1]"
            style={{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 2px)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      )}
      <motion.div
        className="inline-block relative z-2 text-transparent bg-clip-text"
        style={{ ...gradientStyle, backgroundPosition, WebkitBackgroundClip: 'text' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
