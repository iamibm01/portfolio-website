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
    setIsDarkMode(function (prev) {
      const newValue = !prev
      localStorage.setItem('darkMode', String(newValue))
      return newValue
    })
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
  )
}
