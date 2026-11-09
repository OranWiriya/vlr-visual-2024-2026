import { useI18n } from '../i18n'
import { AGENTS, rate, story } from '../lib/story'

const event = (id: string) => story.events.find((entry) => entry.id === id)!
const stage1 = story.snapshots.stage1_2026
const london = event('london-2026')
const bangkok = event('bangkok-2025')
const toronto = event('toronto-2025')
const santiago = event('santiago-2026')

const cards = [
  {
    key: 'tejo' as const,
    patch: '10.09',
    before: rate(bangkok.rates, 'tejo'),
    after: rate(toronto.rates, 'tejo'),
    from: 'Bangkok 2025',
    to: 'Toronto 2025',
    href: '#tejo',
  },
  {
    key: 'yoru' as const,
    patch: '12.05',
    before: rate(santiago.rates, 'yoru'),
    after: rate(stage1.rates, 'yoru'),
    from: 'Santiago 2026',
    to: 'Stage 1 2026',
    href: '#yoru',
  },
  {
    key: 'neon' as const,
    patch: '12.09',
    before: rate(stage1.rates, 'neon'),
    after: rate(london.rates, 'neon'),
    from: 'Stage 1 2026',
    to: 'London 2026',
    href: '#neon',
  },
]

export function StatCards() {
  const { t } = useI18n()

  return (
    <section id="cliff" className="scroll-mt-20 border-b border-line bg-paper-deep/60">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
            {t.statCards.eyebrow}
          </p>
          <p className="text-[11px] text-muted">
            {t.statCards.sub}
          </p>
        </div>

        <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.key}
              href={card.href}
              aria-label={t.statCards.readChapterAria(
                AGENTS[card.key].label,
                card.before.toFixed(0),
                card.from,
                card.after.toFixed(0),
                card.to,
              )}
              className="group bg-paper p-6 transition-colors hover:bg-paper-deep/70 md:p-7"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-2xl text-ink">
                  {AGENTS[card.key].label}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {t.statCards.patchPrefix} {card.patch}
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-3xl leading-none text-muted">
                  {card.before.toFixed(0)}%
                </span>
                <span
                  aria-hidden="true"
                  className="translate-y-[-2px] text-lg text-line"
                >
                  →
                </span>
                <span
                  className="font-serif text-6xl leading-none tracking-tight"
                  style={{ color: AGENTS[card.key].color }}
                >
                  {card.after.toFixed(0)}%
                </span>
              </div>

              <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-muted">
                {card.from} → {card.to}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
