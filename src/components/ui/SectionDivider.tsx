interface SectionDividerProps {
  lightFill: string
  darkFill: string
  direction?: 'left' | 'right' // unused now, kept for API compat
  height?: number
}

function SectionDivider({ lightFill, darkFill, height = 40 }: SectionDividerProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      {/* Light mode */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${lightFill} 100%)`,
        }}
      />
      {/* Dark mode */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${darkFill} 100%)`,
        }}
      />
    </div>
  )
}

export default SectionDivider
