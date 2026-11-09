import type { ReactNode } from 'react'

type PullQuoteProps = {
  children: ReactNode
  attribution?: string
}

export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <blockquote className="my-10 border-l-2 border-accent pl-6 md:pl-8">
      <p className="font-serif text-2xl leading-snug text-ink md:text-[1.75rem]">
        {children}
      </p>
      {attribution ? (
        <footer className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  )
}
