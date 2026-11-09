import { useI18n } from '../i18n'
import { AGENTS, PATCHES, timeline } from '../lib/story'
import { Reveal } from './Reveal'
import { LineChart } from './charts/LineChart'

const series = [
  { key: 'yoru', label: 'Yoru', color: AGENTS.yoru.color },
  { key: 'neon', label: 'Neon', color: AGENTS.neon.color },
  { key: 'tejo', label: 'Tejo', color: AGENTS.tejo.color },
  { key: 'omen', label: 'Omen', color: AGENTS.omen.color, dashed: true },
]

export function Hero() {
  const { t } = useI18n()

  const localizedPatches = [
    {
      ...PATCHES[0],
      title: t.chapters.c7.patches.p1009.title,
      label: t.chapters.c7.patches.p1009.date,
    },
    {
      ...PATCHES[1],
      title: t.chapters.c7.patches.p1205.title,
      label: t.chapters.c7.patches.p1205.date,
    },
    {
      ...PATCHES[2],
      title: t.chapters.c7.patches.p1209.title,
      label: t.chapters.c7.patches.p1209.date,
    },
  ]

  return (
    <section id="top" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-accent">
                {t.hero.eyebrow}
              </p>
              <h1 className="mt-7 font-serif text-[clamp(3.4rem,8.6vw,7rem)] leading-[0.86] tracking-[-0.035em] text-ink">
                {t.hero.titlePart1}
                <br />
                {t.hero.titlePart2}
              </h1>
            </Reveal>
          </div>

          <div className="md:col-span-5 md:pt-3">
            <Reveal delay={120}>
              <p className="max-w-md font-serif text-2xl leading-tight text-ink md:text-[1.75rem]">
                {t.hero.subtitle}
              </p>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
                {t.hero.description}
              </p>
              <a
                href="#cliff"
                className="mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent"
              >
                {t.hero.cta}
                <span aria-hidden="true">↓</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-14 pt-12 md:pt-16">
        <Reveal>
          <LineChart
            points={timeline}
            series={series}
            patches={localizedPatches}
            height={520}
            ariaLabel={t.hero.chartAria}
            caption={t.hero.chartCaption}
          />
        </Reveal>
      </div>
    </section>
  )
}
