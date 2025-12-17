import { useState } from 'react'
import { PERSONAL_INFO, NAV_ITEMS } from '../../data/constants'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="#" 
            className="text-2xl font-heading font-bold text-gray-900 hover:text-primary transition-colors"
          >
            {PERSONAL_INFO.name}
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(function(item) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          <button
            onClick={function() { setIsMobileMenuOpen(!isMobileMenuOpen) }}
            className="md:hidden text-gray-600 hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            {NAV_ITEMS.map(function(item) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={function() { setIsMobileMenuOpen(false) }}
                  className="block text-gray-600 hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar