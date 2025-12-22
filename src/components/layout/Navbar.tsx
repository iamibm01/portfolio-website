import { useState } from 'react'
import { NAV_ITEMS, PERSONAL_INFO } from '../../data/constants'
import { useTheme } from '../../context/ThemeContext'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          <a 
            href="#" 
            className="text-2xl font-heading font-bold text-gray-900 hover:text-primary transition-colors dark:text-white"
          >
            {PERSONAL_INFO.name}
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(function(item) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-primary transition-colors font-medium dark:text-gray-300"
                >
                  {item.label}
                </a>
              )
            })}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
          
          <button
            onClick={function() { setIsMobileMenuOpen(!isMobileMenuOpen) }}
            className="md:hidden text-gray-600 hover:text-primary transition-colors dark:text-gray-300"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <div className="px-6 py-4 space-y-4">
            {NAV_ITEMS.map(function(item) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={function() { setIsMobileMenuOpen(false) }}
                  className="block text-gray-600 hover:text-primary transition-colors font-medium dark:text-gray-300"
                >
                  {item.label}
                </a>
              )
            })}
            
            {/* Dark Mode Toggle for Mobile */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar