import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

interface CountUpProps {
  to: number
  from?: number
  direction?: 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
  startWhen?: boolean
  separator?: string
  onStart?: () => void
  onEnd?: () => void
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? to : from)
  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)
  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  })
  const isInView = useInView(ref, { once: false, margin: '0px' })

  const getDecimalPlaces = function(num: number): number {
    const str = num.toString()
    if (str.includes('.')) {
      const decimals = str.split('.')[1]
      if (parseInt(decimals) !== 0) {
        return decimals.length
      }
    }
    return 0
  }

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to))

  const formatValue = useCallback(
    function(latest: number) {
      const hasDecimals = maxDecimals > 0
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      }
      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest)
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber
    },
    [maxDecimals, separator]
  )

  useEffect(function() {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from)
    }
  }, [from, to, direction, formatValue])

useEffect(function() {
  if (isInView && startWhen) {
    // Reset to start value
    motionValue.set(direction === 'down' ? to : from)
    
    if (typeof onStart === 'function') {
      onStart()
    }
    
    const timeoutId = setTimeout(function() {
      motionValue.set(direction === 'down' ? from : to)
    }, delay * 1000)

    const durationTimeoutId = setTimeout(
      function() {
        if (typeof onEnd === 'function') {
          onEnd()
        }
      },
      delay * 1000 + duration * 1000
    )

    return function() {
      clearTimeout(timeoutId)
      clearTimeout(durationTimeoutId)
    }
  } else if (!isInView) {
    // Reset when out of view
    motionValue.set(direction === 'down' ? to : from)
  }
}, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration])

  useEffect(function() {
    const unsubscribe = springValue.on('change', function(latest: number) {
      if (ref.current) {
        ref.current.textContent = formatValue(latest)
      }
    })
    return function() {
      unsubscribe()
    }
  }, [springValue, formatValue])

  return <span className={className} ref={ref} />
}