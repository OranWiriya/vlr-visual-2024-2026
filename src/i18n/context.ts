import { createContext, useContext } from 'react'
import type { Locale, Translations } from './types'

export type I18nContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

export const I18nContext = createContext<I18nContextType | null>(null)

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
