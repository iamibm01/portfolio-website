import { useState, useEffect, ReactNode } from 'react'
import { ThemeContext } from './useTheme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(function () {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    [isDarkMode]
  )

  const toggleDarkMode = function () {
    document.documentElement.classList.add('theme-transitioning')
    setIsDarkMode(function (prev) {
      const newValue = !prev
      localStorage.setItem('darkMode', String(newValue))
      return newValue
    })
    setTimeout(function () {
      document.documentElement.classList.remove('theme-transitioning')
    }, 600)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
  )
}
