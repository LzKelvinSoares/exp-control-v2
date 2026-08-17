'use client'

import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const themeContextDefaultValue: ThemeContextProps = {
  theme: 'light',
  setTheme: () => {},
}

const ThemeContext = createContext<ThemeContextProps>(themeContextDefaultValue)

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark') setThemeState(saved)
  }, [])

  function setTheme(next: Theme) {
    setThemeState(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
