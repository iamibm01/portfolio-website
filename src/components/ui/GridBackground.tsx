function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <img 
        src="/hero-grid-background.svg" 
        alt="" 
        className="w-full h-full object-cover opacity-100 dark:opacity-100 will-change-transform"
      />
    </div>
  )
}

export default GridBackground