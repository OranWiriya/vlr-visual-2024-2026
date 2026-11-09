import { useMemo } from 'react'
import {
  curveMonotoneX,
  line as d3Line,
  scaleLinear,
  scaleTime,
  timeFormat,
} from 'd3'
import { useI18n } from '../../i18n'
import { rate, type Patch, type TimelinePoint } from '../../lib/story'
import { useInView, useReducedMotion } from '../../lib/useInView'

type Series = {
  key: string
  label: string
  color: string
  dashed?: boolean
}

type Callout = {
  pointId: string
  seriesKey: string
  text: string
  dx?: number
  dy?: number
}

type LineChartProps = {
  points: TimelinePoint[]
  series: Series[]
  patches?: Patch[]
  callouts?: Callout[]
  height?: number
  yMax?: number
  area?: boolean
  ariaLabel: string
  caption?: string
  className?: string
}

const DAY = 24 * 60 * 60 * 1000
const EVENT_LABELS: Record<string, string> = {
  'madrid-2024': 'Madrid',
  'bangkok-2025': 'Bangkok',
  'toronto-2025': 'Toronto',
  'santiago-2026': 'Santiago',
  'london-2026': 'London',
}

export function LineChart({
  points,
  series,
  patches = [],
  callouts = [],
  height = 500,
  yMax = 100,
  area = false,
  ariaLabel,
  caption,
  className = '',
}: LineChartProps) {
  const { t } = useI18n()
  const { ref, inView } = useInView<HTMLElement>(0.25)
  const reduced = useReducedMotion()
  const animate = inView || reduced

  const width = 960
  const margin = { top: 56, right: 142, bottom: 72, left: 54 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const { x, y, linePath, endLabels } = useMemo(() => {
    const times = points.map((point) => new Date(point.date).getTime())
    const domainStart = new Date(Math.min(...times) - 40 * DAY)
    const domainEnd = new Date(Math.max(...times) + 100 * DAY)

    const xScale = scaleTime().domain([domainStart, domainEnd]).range([0, innerW])
    const yScale = scaleLinear().domain([0, yMax]).range([innerH, 0])

    const paths = series.map((entry) => {
      const path = d3Line<TimelinePoint>()
        .x((point) => xScale(new Date(point.date)))
        .y((point) => yScale(rate(point.rates, entry.key)))
        .curve(curveMonotoneX)
      return { key: entry.key, d: path(points) ?? '' }
    })

    // Keep end-of-line labels from colliding.
    const labels = series
      .map((entry) => {
        const last = points[points.length - 1]
        return {
          ...entry,
          value: rate(last.rates, entry.key),
          y: yScale(rate(last.rates, entry.key)),
          x: xScale(new Date(last.date)),
        }
      })
      .sort((a, b) => a.y - b.y)

    let previous = -Infinity
    for (const label of labels) {
      if (label.y - previous < 19) label.y = previous + 19
      previous = label.y
    }

    return {
      x: xScale,
      y: yScale,
      linePath: (key: string) => paths.find((path) => path.key === key)?.d ?? '',
      endLabels: labels,
    }
  }, [points, series, innerW, innerH, yMax])

  const yTicks = [0, 25, 50, 75, 100]
  const yearTicks = [2024, 2025, 2026].map((year) => new Date(`${year}-01-01`))
  const yearFormat = timeFormat('%Y')

  return (
    <figure ref={ref} className={`min-w-0 ${className}`}>
      <div className="w-full min-w-0 overflow-x-auto pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[720px]"
          role="img"
          aria-label={ariaLabel}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {yTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={0}
                  x2={innerW}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke="#d9d4c8"
                  strokeWidth={1}
                  strokeDasharray={tick === 0 ? undefined : '2 5'}
                  opacity={tick === 0 ? 1 : 0.7}
                />
                <text
                  x={-12}
                  y={y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted text-[10px]"
                >
                  {tick}%
                </text>
              </g>
            ))}

            {yearTicks.map((tick) => (
              <g key={tick.toISOString()}>
                <line
                  x1={x(tick)}
                  x2={x(tick)}
                  y1={innerH}
                  y2={innerH + 5}
                  stroke="#b9b2a4"
                />
                <text
                  x={x(tick)}
                  y={innerH + 22}
                  textAnchor="middle"
                  className="fill-muted text-[11px] font-medium"
                >
                  {yearFormat(tick)}
                </text>
              </g>
            ))}

            {points.map((point) => (
              <line
                key={point.id}
                x1={x(new Date(point.date))}
                x2={x(new Date(point.date))}
                y1={innerH}
                y2={innerH + 3}
                stroke="#c9c3b6"
              />
            ))}

            {points
              .filter((point) => EVENT_LABELS[point.id])
              .map((point, index) => (
                <text
                  key={point.id}
                  x={x(new Date(point.date))}
                  y={innerH + (index % 2 === 0 ? 42 : 56)}
                  textAnchor="middle"
                  className="fill-muted text-[10px]"
                >
                  {EVENT_LABELS[point.id]}
                </text>
              ))}

            {points
              .filter((point) => point.kind === 'regional')
              .map((point) => (
                <g key={point.id}>
                  <line
                    x1={x(new Date(point.date))}
                    x2={x(new Date(point.date))}
                    y1={-30}
                    y2={innerH}
                    stroke="#9ca3af"
                    strokeDasharray="2 4"
                    opacity={0.7}
                  />
                  <text
                    x={x(new Date(point.date))}
                    y={-38}
                    textAnchor="middle"
                    className="fill-muted text-[9px] font-semibold uppercase tracking-[0.14em]"
                  >
                    {t.charts.stage1Regional}
                  </text>
                </g>
              ))}

            {patches.map((patch, index) => {
              const patchX = x(new Date(patch.date))
              const textAnchor =
                patchX > innerW * 0.72
                  ? 'end'
                  : patchX < innerW * 0.18
                    ? 'start'
                    : 'middle'
              return (
                <g key={patch.version} opacity={animate ? 1 : 0} style={{ transition: 'opacity 900ms ease 400ms' }}>
                  <line
                    x1={patchX}
                    x2={patchX}
                    y1={-6}
                    y2={innerH}
                    stroke="#d7263d"
                    strokeWidth={1.25}
                    strokeDasharray="4 5"
                    opacity={0.7}
                  />
                  <circle cx={patchX} cy={-6} r={3} fill="#d7263d" />
                  <text
                    x={patchX + (textAnchor === 'end' ? -4 : textAnchor === 'start' ? 4 : 0)}
                    y={index % 2 === 0 ? 12 : 25}
                    textAnchor={textAnchor}
                    className="fill-accent text-[9px] font-semibold uppercase tracking-[0.12em]"
                  >
                    {patch.version}
                  </text>
                  <title>{`Patch ${patch.version} · ${patch.title} · ${patch.label}`}</title>
                </g>
              )
            })}

            {area && series[0] ? (
              <path
                d={`${linePath(series[0].key)} L ${x(new Date(points[points.length - 1].date))} ${y(0)} L ${x(new Date(points[0].date))} ${y(0)} Z`}
                fill={series[0].color}
                opacity={animate ? 0.08 : 0}
                style={{ transition: 'opacity 1.2s ease 300ms' }}
              />
            ) : null}

            {series.map((entry) => (
              <path
                key={entry.key}
                d={linePath(entry.key)}
                fill="none"
                stroke={entry.color}
                strokeWidth={entry.dashed ? 1.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={entry.dashed ? '5 5' : undefined}
                opacity={entry.dashed ? 0.75 : 1}
                pathLength={entry.dashed ? undefined : 1}
                style={
                  entry.dashed
                    ? undefined
                    : {
                        strokeDasharray: 1,
                        strokeDashoffset: animate ? 0 : 1,
                        transition: 'stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)',
                      }
                }
              />
            ))}

            {series.flatMap((entry) =>
              points.map((point, index) => {
                const value = rate(point.rates, entry.key)
                const cx = x(new Date(point.date))
                const cy = y(value)
                const isRegional = point.kind === 'regional'
                return (
                  <g
                    key={`${entry.key}-${point.id}`}
                    opacity={animate ? 1 : 0}
                    style={{
                      transition: `opacity 500ms ease ${600 + index * 70}ms`,
                    }}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isRegional ? 4.5 : 3.75}
                      fill={isRegional ? '#f7f5ef' : '#f7f5ef'}
                      stroke={entry.color}
                      strokeWidth={isRegional ? 2.5 : 2}
                      strokeDasharray={isRegional ? '2 2' : undefined}
                    >
                      <title>{`${point.label} · ${entry.label} ${value.toFixed(0)}%`}</title>
                    </circle>
                  </g>
                )
              }),
            )}

            {endLabels.map((label) => (
              <g
                key={label.key}
                opacity={animate ? 1 : 0}
                style={{ transition: 'opacity 700ms ease 1200ms' }}
              >
                <text
                  x={label.x + 12}
                  y={label.y}
                  dominantBaseline="middle"
                  className="text-[11px] font-semibold"
                  fill={label.color}
                >
                  {label.label}
                </text>
                <text
                  x={label.x + 12}
                  y={label.y + 13}
                  dominantBaseline="middle"
                  className="fill-muted text-[10px]"
                >
                  {label.value.toFixed(0)}%
                </text>
              </g>
            ))}

            {callouts.map((callout) => {
              const point = points.find((entry) => entry.id === callout.pointId)
              if (!point) return null
              const cx = x(new Date(point.date))
              const cy = y(rate(point.rates, callout.seriesKey))
              const dx = callout.dx ?? 0
              const dy = callout.dy ?? -24
              return (
                <g
                  key={`${callout.pointId}-${callout.seriesKey}`}
                  opacity={animate ? 1 : 0}
                  style={{ transition: 'opacity 600ms ease 1400ms' }}
                >
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx + dx}
                    y2={cy + dy}
                    stroke="#141311"
                    strokeWidth={1}
                  />
                  <text
                    x={cx + dx}
                    y={cy + dy - 6}
                    textAnchor="middle"
                    className="fill-ink text-[11px] font-semibold"
                  >
                    {callout.text}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {series.map((entry) => (
          <span
            key={entry.key}
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
          >
            <span
              className="inline-block h-[2px] w-5"
              style={{
                backgroundColor: entry.color,
                opacity: entry.dashed ? 0.7 : 1,
              }}
            />
            {entry.label}
          </span>
        ))}
        {points.some((point) => point.kind === 'regional') ? (
          <span className="flex items-center gap-2 text-[11px] text-muted">
            <span className="inline-block size-2.5 rounded-full border-2 border-dashed border-muted" />
            {t.charts.regionalStage1Snapshot}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted sm:hidden">
        {t.charts.swipeTimeline}
      </p>

      {caption ? (
        <figcaption className="mt-3 text-[12px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
