import { createContext } from 'react'

export const themes = {
  LIGHT: 'light',
  DARK: 'dark',
}

export const GlobalContext = createContext({
  theme: themes.LIGHT
})