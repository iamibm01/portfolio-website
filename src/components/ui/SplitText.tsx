import React, { useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitType?: 'chars' | 'words'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  threshold?: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  textAlign?: React.CSSProperties['textAlign']
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold: _threshold = 0.1,
  tag = 'h2',
  textAlign = 'center'
}) => {
  const ref = useRef<HTMLElement>(null)
  const splits = useMemo(function() {
    return splitType === 'chars' ? text.split('') : text.split(' ')
  }, [text, splitType])

  useGSAP(function() {
    if (!ref.current || splits.length === 0) return

    const elements = ref.current.querySelectorAll('.split-item')
    
    gsap.fromTo(
      elements,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          once: false
        }
      }
    )
  }, { dependencies: [splits, delay, duration, ease, from, to], scope: ref })

  const style: React.CSSProperties = {
    textAlign,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
    gap: splitType === 'words' ? '0.25em' : '0'
  }

  const classes = `split-parent ${className}`

  const content = splits.map(function(item, index) {
    return (
      <span
        key={index}
        className="split-item inline-block"
        style={{ whiteSpace: splitType === 'chars' && item === ' ' ? 'pre' : 'normal' }}
      >
        {item === ' ' && splitType === 'chars' ? '\u00A0' : item}
      </span>
    )
  })

  switch (tag) {
    case 'h1':
      return <h1 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{content}</h1>
    case 'h2':
      return <h2 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{content}</h2>
    case 'h3':
      return <h3 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{content}</h3>
    case 'h4':
      return <h4 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{content}</h4>
    case 'h5':
      return <h5 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{content}</h5>
    case 'h6':
      return <h6 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{content}</h6>
    default:
      return <p ref={ref as React.RefObject<HTMLParagraphElement>} style={style} className={classes}>{content}</p>
  }
}

export default SplitText