import { useI18n } from '../../i18n'
import { AGENTS, stage1Regions } from '../../lib/story'
import { useInView, useReducedMotion } from '../../lib/useInView'

export function RegionalBars() {
  const { t } = useI18n()
  const c = t.chapters.c4

  const { ref, inView } = useInView<HTMLElement>(0.3)
  const reduced = useReducedMotion()
  const animate = inView || reduced

  const average =
    stage1Regions.reduce((sum, region) => sum + region.value, 0) /
    stage1Regions.length
  const totalMaps = stage1Regions.reduce((sum, region) => sum + region.maps, 0)

  const regionsSummary = stage1Regions
    .map((region) => `${region.region} ${region.value.toFixed(0)}%`)
    .join(', ')

  return (
    <figure
      ref={ref}
      className="min-w-0 rounded-sm border border-line bg-paper-deep/40 p-5 md:p-7"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            {c.chartEyebrow}
          </p>
          <p className="mt-1 font-serif text-3xl text-ink md:text-4xl">
            {c.chartTitle}
          </p>
        </div>
        <p
          className="font-serif text-5xl leading-none md:text-6xl"
          style={{ color: AGENTS.neon.color }}
        >
          {average.toFixed(0)}%
        </p>
      </div>

      <div
        className="space-y-5"
        role="img"
        aria-label={c.chartAria(regionsSummary)}
      >
        {stage1Regions.map((region, index) => (
          <div key={region.region}>
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-ink">{region.region}</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted">
                  {region.maps} {c.chartMapsUnit}
                </span>
              </div>
              <span className="font-serif text-2xl leading-none text-ink">
                {region.value.toFixed(0)}%
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-line/60">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: animate ? `${region.value}%` : '0%',
                  backgroundColor: AGENTS.neon.color,
                  transition: `width 900ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[11px] text-muted">
        <span>
          {c.chartAvgFootnote(totalMaps, average.toFixed(0))}
        </span>
        <span>{c.chartSlotFootnote}</span>
      </div>
    </figure>
  )
}
