import { useEffect, useState, type ReactNode } from 'react'
import { I18nContext } from './context'
import { en } from './locales/en'
import { th } from './locales/th'
import type { Locale, Translations } from './types'

const translations: Record<Locale, Translations> = { en, th }

const STORAGE_KEY = 'meta_esports_locale'

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'th') {
    return saved
  }

  const browserLang = navigator.language?.toLowerCase()
  if (browserLang?.startsWith('th')) {
    return 'th'
  }

  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // ignore storage errors
    }
  }

  const t = translations[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t.meta.title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', t.meta.description)
    }
  }, [locale, t])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}
