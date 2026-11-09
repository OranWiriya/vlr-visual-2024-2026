import { useI18n } from '../i18n'
import { rate, story, type Rates } from '../lib/story'

const AGENT_COLUMNS = ['tejo', 'yoru', 'neon', 'omen', 'viper', 'sova'] as const
const AGENT_LABELS: Record<(typeof AGENT_COLUMNS)[number], string> = {
  tejo: 'Tejo',
  yoru: 'Yoru',
  neon: 'Neon',
  omen: 'Omen',
  viper: 'Viper',
  sova: 'Sova',
}

type TableRow = {
  label: string
  date: string
  maps: number
  rates: Rates
  kind: 'international' | 'regional'
  reconstructed?: boolean
}

const tableRows: TableRow[] = [
  ...story.events.map((event) => ({
    label: event.label,
    date: event.date,
    maps: event.maps,
    rates: event.rates,
    kind: 'international' as const,
    reconstructed: event.source === 'overview',
  })),
  {
    label: 'Stage 1 2026',
    date: '2026-04-20',
    maps: story.snapshots.stage1_2026.maps,
    rates: story.snapshots.stage1_2026.rates,
    kind: 'regional' as const,
  },
].sort((a, b) => a.date.localeCompare(b.date))

export function Footer() {
  const { locale, t } = useI18n()

  const monthYear = (date: string) => {
    const [year, month] = date.split('-')
    const monthName = t.charts.months[Number(month) - 1]
    return `${monthName} ${year}`
  }

  const built = new Date(story.generatedAt).toLocaleDateString(
    locale === 'th' ? 'th-TH' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )

  return (
    <footer
      id="methodology"
      className="scroll-mt-20 border-t border-line bg-paper-deep/60"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              {t.footer.methodologyEyebrow}
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-ink md:text-5xl">
              {t.footer.methodologyTitle}
            </h2>
            <div className="mt-6 space-y-4 text-[14px] leading-relaxed text-muted">
              <p>{t.footer.methodologyP1}</p>
              <p>{t.footer.methodologyP2}</p>
              <p>{t.footer.methodologyP3}</p>
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              {t.footer.limitsEyebrow}
            </p>
            <ul className="mt-5 space-y-4 border-t border-line pt-5 text-[14px] leading-relaxed text-muted">
              {t.footer.limits.map((limit) => (
                <li key={limit.title}>
                  <strong className="font-semibold text-ink">
                    {limit.title}
                  </strong>{' '}
                  {limit.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-serif text-2xl text-ink">
              {t.footer.tableTitle}
            </h3>
            <p className="text-[11px] text-muted">
              {t.footer.tableSub}
            </p>
          </div>

          <div className="mt-5 max-w-full min-w-0 overflow-x-auto rounded-sm border border-line bg-paper">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                {t.footer.tableCaption}
              </caption>
              <thead>
                <tr className="border-b border-line text-[10px] uppercase tracking-[0.14em] text-muted">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t.footer.colEvent}
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    {t.footer.colDate}
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-right font-semibold"
                  >
                    {t.footer.colMaps}
                  </th>
                  {AGENT_COLUMNS.map((agent) => (
                    <th
                      key={agent}
                      scope="col"
                      className="px-3 py-3 text-right font-semibold"
                    >
                      {AGENT_LABELS[agent]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={`${row.label}-${row.date}`}
                    className={`border-b border-line/70 last:border-b-0 ${
                      row.kind === 'regional' ? 'bg-paper-deep/50' : ''
                    }`}
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-[13px] font-medium text-ink"
                    >
                      {row.label}
                      {row.reconstructed ? (
                        <span className="text-accent"> †</span>
                      ) : null}
                      {row.kind === 'regional' ? (
                        <span className="text-accent"> ‡</span>
                      ) : null}
                    </th>
                    <td className="px-3 py-3 text-[12px] text-muted">
                      {monthYear(row.date)}
                    </td>
                    <td className="px-3 py-3 text-right text-[12px] tabular-nums text-muted">
                      {row.maps}
                    </td>
                    {AGENT_COLUMNS.map((agent) => (
                      <td
                        key={agent}
                        className="px-3 py-3 text-right text-[13px] tabular-nums text-ink"
                      >
                        {rate(row.rates, agent).toFixed(0)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted sm:hidden">
            {t.footer.tableScrollHint}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-muted">
            {t.footer.tableFootnote}
          </p>
        </div>

        <div
          id="sources"
          className="mt-16 grid scroll-mt-20 gap-10 border-t border-line pt-10 md:grid-cols-12 md:gap-16"
        >
          <div className="md:col-span-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
              {t.footer.sourcesEyebrow}
            </h3>
          </div>
          <div className="md:col-span-8">
            <ul className="space-y-4">
              {t.footer.sources.map((source) => (
                <li key={source.label} className="text-[13px] leading-relaxed">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {source.label}
                  </a>
                  <span className="text-muted"> — {source.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-line pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-serif text-xl text-ink">
              {t.nav.siteTitle}
            </p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {t.footer.builtLabel(built)}
            </p>
          </div>
          <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-muted">
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  )
}
