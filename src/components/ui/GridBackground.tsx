import { useEffect, useState } from 'react'

function GridBackground() {
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(function () {
    fetch('/hero-grid-background.svg')
      .then(function (response) {
        return response.text()
      })
      .then(function (text) {
        setSvgContent(text)
      })
  }, [])

  // Simple rotation animation with scaling
  useEffect(
    function () {
      if (!svgContent) return

      const style = document.createElement('style')
      style.textContent = `
      /* Slow rotation with scale to cover corners */
      .grid-svg-container svg {
        animation: rotate-grid 60s linear infinite;
        transform-origin: center center;
        width: 150%;
        height: 150%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      @keyframes rotate-grid {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `
      document.head.appendChild(style)

      return function () {
        document.head.removeChild(style)
      }
    },
    [svgContent]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="w-full h-full opacity-90 dark:opacity-100 grid-svg-container"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  )
}

export default GridBackground
