import { useI18n } from '../i18n'
import { AGENTS, type AgentKey } from '../lib/story'

type TimelineItem = {
  version: string
  date: string
  title: string
  detail: string
  effect: string
  agent?: AgentKey
  badge?: string
  muted?: boolean
}

export function PatchTimeline() {
  const { t } = useI18n()
  const p = t.chapters.c7.patches

  const items: TimelineItem[] = [
    {
      version: '10.09',
      date: p.p1009.date,
      title: p.p1009.title,
      detail: p.p1009.detail,
      effect: p.p1009.effect,
      agent: 'tejo',
    },
    {
      version: '12.05',
      date: p.p1205.date,
      title: p.p1205.title,
      detail: p.p1205.detail,
      effect: p.p1205.effect,
      agent: 'yoru',
    },
    {
      version: '12.09',
      date: p.p1209.date,
      title: p.p1209.title,
      detail: p.p1209.detail,
      effect: p.p1209.effect,
      agent: 'neon',
    },
    {
      version: '13.00',
      date: p.p1300.date,
      title: p.p1300.title,
      detail: p.p1300.detail,
      effect: p.p1300.effect,
      badge: p.p1300.badge,
      muted: true,
    },
  ]

  return (
    <ol className="grid gap-4 md:grid-cols-4">
      {items.map((item) => {
        const color = item.agent ? AGENTS[item.agent].color : '#6f6a60'
        return (
          <li
            key={item.version}
            className={`relative rounded-sm border-t-2 bg-paper p-5 ${
              item.muted ? 'border-dashed' : ''
            }`}
            style={{ borderTopColor: color }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-3xl leading-none text-ink">
                {item.version}
              </span>
              {item.badge ? (
                <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {item.badge}
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </div>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {item.date}
            </p>

            <h3 className="mt-4 text-sm font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {item.detail}
            </p>

            <p
              className="mt-4 border-t border-line pt-3 font-serif text-lg leading-none"
              style={{ color }}
            >
              {item.effect}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
