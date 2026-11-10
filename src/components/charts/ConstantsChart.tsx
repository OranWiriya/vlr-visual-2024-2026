import { scaleLinear } from 'd3'
import { useI18n } from '../../i18n'
import { constants } from '../../lib/story'
import { useElementWidth } from '../../lib/useElementWidth'
import { useInView, useReducedMotion } from '../../lib/useInView'

export function ConstantsChart() {
  const { t } = useI18n()
  const c6 = t.chapters.c6

  const { ref, inView } = useInView<HTMLElement>(0.3)
  const reduced = useReducedMotion()
  const animate = inView || reduced

  const { ref: widthRef, width: measuredWidth } = useElementWidth<HTMLDivElement>()
  const designWidth = 900
  const baseHeight = 330
  const compact = measuredWidth > 0 && measuredWidth < 560
  const width = compact ? measuredWidth : designWidth
  const height = compact ? 300 : baseHeight
  const margin = compact
    ? { top: 28, right: 30, bottom: 50, left: 64 }
    : { top: 34, right: 44, bottom: 58, left: 88 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const x = scaleLinear().domain([0, 100]).range([0, innerW])
  const rowHeight = innerH / constants.length
  const ticks = [0, 25, 50, 75, 100]

  const summary = constants
    .map((agent) => `${agent.label} ${agent.min.toFixed(0)} to ${agent.max.toFixed(0)}%`)
    .join(', ')

  return (
    <figure
      ref={ref}
      className="w-full min-w-0 rounded-sm border border-line bg-paper-deep/40 p-5 md:p-7"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          {c6.chartEyebrow}
        </p>
        <p className="text-[11px] text-muted">{c6.chartSub}</p>
      </div>

      <div ref={widthRef} className="w-full min-w-0">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={c6.chartAria(summary)}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={x(tick)}
                  x2={x(tick)}
                  y1={-8}
                  y2={innerH}
                  stroke="#d9d4c8"
                  strokeDasharray={tick === 0 ? undefined : '2 5'}
                  opacity={tick === 0 ? 1 : 0.6}
                />
                <text
                  x={x(tick)}
                  y={innerH + 22}
                  textAnchor="middle"
                  className="fill-muted text-[10px]"
                >
                  {tick}%
                </text>
              </g>
            ))}

            {constants.map((agent, index) => {
              const cy = rowHeight * index + rowHeight / 2
              const minX = x(agent.min)
              const maxX = x(agent.max)
              const averageX = x(agent.average)
              return (
                <g key={agent.key}>
                  <text
                    x={-16}
                    y={cy}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-ink text-[13px] font-semibold"
                  >
                    {agent.label}
                  </text>
                  <text
                    x={-16}
                    y={cy + 15}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-muted text-[10px]"
                  >
                    {c6.avgLabel(agent.average.toFixed(0))}
                  </text>

                  <line
                    x1={minX}
                    x2={maxX}
                    y1={cy}
                    y2={cy}
                    stroke={agent.color}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={0.28}
                    pathLength={1}
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: animate ? 0 : 1,
                      transition: `stroke-dashoffset 1.2s ease ${index * 140}ms`,
                    }}
                  />

                  {agent.values.map((value, valueIndex) => (
                    <circle
                      key={value.id}
                      cx={x(value.value)}
                      cy={cy}
                      r={4}
                      fill="#f7f5ef"
                      stroke={agent.color}
                      strokeWidth={2}
                      opacity={animate ? 1 : 0}
                      style={{
                        transition: `opacity 400ms ease ${500 + index * 140 + valueIndex * 50}ms`,
                      }}
                    >
                      <title>{`${agent.label} · ${value.label} ${value.value.toFixed(0)}%`}</title>
                    </circle>
                  ))}

                  <line
                    x1={averageX}
                    x2={averageX}
                    y1={cy - 9}
                    y2={cy + 9}
                    stroke={agent.color}
                    strokeWidth={1}
                    opacity={0.6}
                  />
                  <text
                    x={maxX + 8}
                    y={cy - 10}
                    className="fill-muted text-[9px]"
                  >
                    {agent.max.toFixed(0)}%
                  </text>
                  <text
                    x={minX - 8}
                    y={cy + 16}
                    textAnchor="end"
                    className="fill-muted text-[9px]"
                  >
                    {agent.min.toFixed(0)}%
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <figcaption className="mt-3 text-[12px] leading-relaxed text-muted">
        {c6.chartRangeCaption}
      </figcaption>
    </figure>
  )
}
