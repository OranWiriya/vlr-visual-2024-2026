import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'

export function Header() {
  const [progress, setProgress] = useState(0)
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      setProgress(max > 0 ? root.scrollTop / max : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a
          href="#top"
          className="font-serif text-lg leading-none tracking-tight text-ink"
        >
          {t.nav.siteTitle}
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted sm:gap-6">
            <a className="hidden transition-colors hover:text-ink sm:inline" href="#cliff">
              {t.nav.cliffs}
            </a>
            <a className="hidden transition-colors hover:text-ink sm:inline" href="#constants">
              {t.nav.constants}
            </a>
            <a className="transition-colors hover:text-ink" href="#methodology">
              {t.nav.methodology}
            </a>
          </nav>

          <div
            className="flex items-center rounded border border-line bg-paper-deep/60 p-0.5 text-[11px] font-semibold"
            role="group"
            aria-label={t.nav.langSwitchLabel}
          >
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
                locale === 'en'
                  ? 'bg-ink text-paper shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
              aria-pressed={locale === 'en'}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('th')}
              className={`cursor-pointer rounded px-2 py-0.5 transition-colors ${
                locale === 'th'
                  ? 'bg-ink text-paper shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
              aria-pressed={locale === 'th'}
              title="ภาษาไทย"
            >
              TH
            </button>
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-line/60">
        <div
          className="h-px origin-left bg-accent transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  )
}
