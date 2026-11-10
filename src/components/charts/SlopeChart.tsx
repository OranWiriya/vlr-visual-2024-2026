import { scaleLinear } from 'd3'
import { useElementWidth } from '../../lib/useElementWidth'
import { useInView, useReducedMotion } from '../../lib/useInView'

export type SlopeEntry = {
  key: string
  label: string
  color: string
  before: number
  after: number
}

type SlopeChartProps = {
  entries: SlopeEntry[]
  leftLabel: string
  rightLabel: string
  leftSub?: string
  rightSub?: string
  patch?: { version: string; date: string; title: string }
  big?: boolean
  ariaLabel: string
  caption?: string
}

function spread(values: { y: number; entry: SlopeEntry }[], minGap: number) {
  const sorted = [...values].sort((a, b) => a.y - b.y)
  let previous = -Infinity
  for (const item of sorted) {
    if (item.y - previous < minGap) item.y = previous + minGap
    previous = item.y
  }
  return sorted
}

export function SlopeChart({
  entries,
  leftLabel,
  rightLabel,
  leftSub,
  rightSub,
  patch,
  big = false,
  ariaLabel,
  caption,
}: SlopeChartProps) {
  const { ref, inView } = useInView<HTMLElement>(0.3)
  const reduced = useReducedMotion()
  const animate = inView || reduced

  const { ref: widthRef, width: measuredWidth } = useElementWidth<HTMLDivElement>()
  const designWidth = 760
  const baseHeight = big ? 360 : 440
  const compact = measuredWidth > 0 && measuredWidth < 560
  const width = compact ? measuredWidth : designWidth
  const chartHeight = compact ? (big ? 300 : 340) : baseHeight
  const margin = compact
    ? { top: 64, right: 86, bottom: 36, left: 76 }
    : { top: 78, right: 150, bottom: 54, left: 120 }
  const innerW = width - margin.left - margin.right
  const innerH = chartHeight - margin.top - margin.bottom

  const xLeft = compact ? 24 : 80
  const xRight = innerW - (compact ? 24 : 80)
  const y = scaleLinear().domain([0, 100]).range([innerH, 0])

  const yTicks = [0, 25, 50, 75, 100]

  const leftLabels = spread(
    entries.map((entry) => ({ entry, y: y(entry.before) })),
    18,
  )
  const rightLabels = spread(
    entries.map((entry) => ({ entry, y: y(entry.after) })),
    18,
  )

  return (
    <figure ref={ref} className="w-full min-w-0">
      <div ref={widthRef} className="w-full min-w-0 pb-1">
        <svg
          viewBox={`0 0 ${width} ${chartHeight}`}
          className="h-auto w-full"
          role="img"
          aria-label={ariaLabel}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <text
              x={compact ? 0 : xLeft}
              y={compact ? -36 : -42}
              textAnchor={compact ? 'start' : 'middle'}
              className={
                compact
                  ? 'fill-muted text-[9px] font-semibold uppercase'
                  : 'fill-muted text-[10px] font-semibold uppercase tracking-[0.16em]'
              }
            >
              {leftLabel}
            </text>
            {leftSub && !compact ? (
              <text
                x={xLeft}
                y={-28}
                textAnchor="middle"
                className="fill-muted text-[9px]"
              >
                {leftSub}
              </text>
            ) : null}

            <text
              x={compact ? innerW : xRight}
              y={compact ? -14 : -42}
              textAnchor={compact ? 'end' : 'middle'}
              className={
                compact
                  ? 'fill-muted text-[9px] font-semibold uppercase'
                  : 'fill-muted text-[10px] font-semibold uppercase tracking-[0.16em]'
              }
            >
              {rightLabel}
            </text>
            {rightSub && !compact ? (
              <text
                x={xRight}
                y={-28}
                textAnchor="middle"
                className="fill-muted text-[9px]"
              >
                {rightSub}
              </text>
            ) : null}

            {patch && !compact ? (
              <g>
                <text
                  x={innerW / 2}
                  y={-54}
                  textAnchor="middle"
                  className="fill-accent text-[9px] font-semibold uppercase tracking-[0.18em]"
                >
                  Patch {patch.version} · {patch.date}
                </text>
                <text
                  x={innerW / 2}
                  y={-40}
                  textAnchor="middle"
                  className="fill-muted text-[9px]"
                >
                  {patch.title}
                </text>
              </g>
            ) : null}

            {yTicks.map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={innerW}
                y1={y(tick)}
                y2={y(tick)}
                stroke="#d9d4c8"
                strokeDasharray={tick === 0 ? undefined : '2 5'}
                opacity={tick === 0 ? 1 : 0.6}
              />
            ))}

            {entries.map((entry, index) => {
              const yBefore = y(entry.before)
              const yAfter = y(entry.after)
              const path = `M ${xLeft} ${yBefore} L ${xRight} ${yAfter}`
              return (
                <g key={entry.key}>
                  <path
                    d={path}
                    fill="none"
                    stroke={entry.color}
                    strokeWidth={big ? 3 : 2}
                    strokeLinecap="round"
                    pathLength={1}
                    style={{
                      strokeDasharray: 1,
                      strokeDashoffset: animate ? 0 : 1,
                      transition: `stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${index * 120}ms`,
                    }}
                  />
                  <circle
                    cx={xLeft}
                    cy={yBefore}
                    r={big ? 6 : 4.5}
                    fill="#f7f5ef"
                    stroke={entry.color}
                    strokeWidth={2.5}
                    opacity={animate ? 1 : 0}
                    style={{ transition: `opacity 400ms ease ${300 + index * 120}ms` }}
                  >
                    <title>{`${entry.label} ${entry.before.toFixed(0)}%`}</title>
                  </circle>
                  <circle
                    cx={xRight}
                    cy={yAfter}
                    r={big ? 6 : 4.5}
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2.5}
                    opacity={animate ? 1 : 0}
                    style={{ transition: `opacity 400ms ease ${700 + index * 120}ms` }}
                  >
                    <title>{`${entry.label} ${entry.after.toFixed(0)}%`}</title>
                  </circle>
                </g>
              )
            })}

            {big
              ? entries.map((entry) => (
                  <g key={`${entry.key}-labels`}>
                    <text
                      x={xLeft}
                      y={y(entry.before) - 18}
                      textAnchor="middle"
                      className="font-serif text-[38px] font-medium"
                      fill={entry.color}
                      opacity={animate ? 1 : 0}
                      style={{ transition: 'opacity 500ms ease 300ms' }}
                    >
                      {entry.before.toFixed(0)}%
                    </text>
                    <text
                      x={xRight}
                      y={y(entry.after) - 18}
                      textAnchor="middle"
                      className="font-serif text-[38px] font-medium"
                      fill={entry.color}
                      opacity={animate ? 1 : 0}
                      style={{ transition: 'opacity 500ms ease 700ms' }}
                    >
                      {entry.after.toFixed(0)}%
                    </text>
                    <text
                      x={xLeft}
                      y={y(entry.before) + 20}
                      textAnchor="middle"
                      className="fill-muted text-[10px] uppercase tracking-[0.14em]"
                    >
                      {entry.label}
                    </text>
                  </g>
                ))
              : leftLabels.map(({ entry, y: labelY }) => {
                  const pointY = y(entry.before)
                  return (
                    <g key={`left-${entry.key}`}>
                      {Math.abs(labelY - pointY) > 2 ? (
                        <line
                          x1={xLeft - 4}
                          y1={pointY}
                          x2={xLeft - 10}
                          y2={labelY}
                          stroke={entry.color}
                          strokeWidth={1}
                          opacity={0.45}
                        />
                      ) : null}
                      <text
                        x={xLeft - 14}
                        y={labelY}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="text-[11px]"
                      >
                        <tspan fill={entry.color} className="font-semibold">
                          {entry.label}
                        </tspan>
                        <tspan className="fill-muted">
                          {' '}
                          {entry.before.toFixed(0)}%
                        </tspan>
                      </text>
                    </g>
                  )
                })}

            {!big
              ? rightLabels.map(({ entry, y: labelY }) => {
                  const pointY = y(entry.after)
                  return (
                    <g key={`right-${entry.key}`}>
                      {Math.abs(labelY - pointY) > 2 ? (
                        <line
                          x1={xRight + 4}
                          y1={pointY}
                          x2={xRight + 10}
                          y2={labelY}
                          stroke={entry.color}
                          strokeWidth={1}
                          opacity={0.45}
                        />
                      ) : null}
                      <text
                        x={xRight + 14}
                        y={labelY}
                        dominantBaseline="middle"
                        className="text-[11px]"
                      >
                        <tspan fill={entry.color} className="font-semibold">
                          {entry.label}
                        </tspan>
                        <tspan className="fill-muted">
                          {' '}
                          {entry.after.toFixed(0)}%
                        </tspan>
                      </text>
                    </g>
                  )
                })
              : null}
          </g>
        </svg>
      </div>

      {caption ? (
        <figcaption className="mt-3 text-[12px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
