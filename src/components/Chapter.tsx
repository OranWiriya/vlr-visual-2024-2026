import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type ChapterProps = {
  id: string
  number: string
  kicker: string
  title: string
  children: ReactNode
  chart: ReactNode
  reverse?: boolean
  stacked?: boolean
}

export function Chapter({
  id,
  number,
  kicker,
  title,
  children,
  chart,
  reverse = false,
  stacked = false,
}: ChapterProps) {
  const text = (
    <Reveal className="min-w-0">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-5xl leading-none text-accent/30">
          {number}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
          {kicker}
        </p>
      </div>
      <h2 className="mt-6 font-serif text-4xl leading-[1.04] tracking-tight text-ink md:text-5xl">
        {title}
      </h2>
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-muted">
        {children}
      </div>
    </Reveal>
  )

  return (
    <section id={id} className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {stacked ? (
          <>
            <div className="min-w-0 max-w-3xl">{text}</div>
            <div className="mt-12 min-w-0">
              <Reveal delay={120} className="min-w-0">
                {chart}
              </Reveal>
            </div>
          </>
        ) : (
          <div className="grid min-w-0 gap-12 md:grid-cols-12 md:gap-16">
            <div
              className={`min-w-0 md:col-span-5 ${reverse ? 'md:order-2' : ''}`}
            >
              {text}
            </div>
            <div
              className={`min-w-0 md:col-span-7 ${reverse ? 'md:order-1' : ''}`}
            >
              <Reveal delay={120} className="min-w-0">
                {chart}
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
