import raw from '../data/story.json'

export type Rates = Record<string, number>

export type StoryEvent = {
  id: string
  label: string
  year: string
  date: string
  tournament: string
  maps: number
  source: string
  rates: Rates
}

export type StorySnapshot = {
  maps: number
  rates: Rates
  detail: Array<{ tournament: string; maps: number; rates: Rates }>
}

type RawStory = {
  generatedAt: string
  events: StoryEvent[]
  snapshots: {
    kickoff2026: StorySnapshot
    stage1_2026: StorySnapshot
  }
}

export const story = raw as unknown as RawStory

export const AGENTS = {
  tejo: { label: 'Tejo', color: '#b45309' },
  yoru: { label: 'Yoru', color: '#4338ca' },
  neon: { label: 'Neon', color: '#0f766e' },
  omen: { label: 'Omen', color: '#7e22ce' },
  viper: { label: 'Viper', color: '#15803d' },
  sova: { label: 'Sova', color: '#475569' },
  jett: { label: 'Jett', color: '#0369a1' },
  raze: { label: 'Raze', color: '#c2410c' },
  phoenix: { label: 'Phoenix', color: '#b91c1c' },
  waylay: { label: 'Waylay', color: '#a21caf' },
} as const

export type AgentKey = keyof typeof AGENTS

export type Patch = {
  version: string
  date: string
  label: string
  title: string
  detail: string
  effect: string
  agent: AgentKey
}

export const PATCHES: Patch[] = [
  {
    version: '10.09',
    date: '2025-05-13',
    label: 'May 13, 2025',
    title: 'Tejo nerf',
    detail:
      'Guided Salvo lost its cooldown, gained a charge system, and lost 10m of targeting range; Stealth Drone cost 300 → 400; Armageddon 8 → 9 points.',
    effect: 'Tejo 56% → 4%',
    agent: 'tejo' as AgentKey,
  },
  {
    version: '12.05',
    date: '2026-03-17',
    label: 'Mar 17, 2026',
    title: 'Yoru nerf',
    detail:
      'Blindside cut from two charges to one; Gatecrash duration cut from 30 seconds to 15.',
    effect: 'Yoru 62% → 1%',
    agent: 'yoru' as AgentKey,
  },
  {
    version: '12.09',
    date: '2026-05-12',
    label: 'May 12, 2026',
    title: 'Neon + shotgun nerf',
    detail:
      'No airborne speed bonus; kill-based fuel regen only during her ultimate; every shotgun less accurate while moving.',
    effect: 'Neon 79% → 32%',
    agent: 'neon' as AgentKey,
  },
]

export type TimelinePoint = {
  id: string
  label: string
  date: string
  rates: Rates
  kind: 'international' | 'regional'
  maps: number
}

export const timeline: TimelinePoint[] = [
  ...story.events.map((event) => ({
    id: event.id,
    label: event.label,
    date: `${event.date}-15`,
    rates: event.rates,
    kind: 'international' as const,
    maps: event.maps,
  })),
  {
    id: 'stage1-2026',
    label: 'Stage 1',
    date: '2026-04-20',
    rates: story.snapshots.stage1_2026.rates,
    kind: 'regional' as const,
    maps: story.snapshots.stage1_2026.maps,
  },
].sort((a, b) => a.date.localeCompare(b.date))

export function rate(rates: Rates, agent: string): number {
  return rates[agent] ?? 0
}

export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`
}

export const london = story.events.find((event) => event.id === 'london-2026')!

export const duelistShift = (
  ['neon', 'jett', 'phoenix', 'raze', 'waylay'] as const
).map((key) => ({
  key,
  label: AGENTS[key].label,
  color: AGENTS[key].color,
  before: rate(story.snapshots.stage1_2026.rates, key),
  after: rate(london.rates, key),
}))

export const stage1Regions = story.snapshots.stage1_2026.detail.map((detail) => ({
  region: detail.tournament
    .replace('VCT 2026: ', '')
    .replace(' Stage 1', ''),
  maps: detail.maps,
  value: rate(detail.rates, 'neon'),
}))

export const constants = (['omen', 'viper', 'sova'] as const).map((key) => {
  const values = story.events.map((event) => ({
    id: event.id,
    label: event.label,
    value: rate(event.rates, key),
  }))
  const numbers = values.map((entry) => entry.value)
  return {
    key,
    label: AGENTS[key].label,
    color: AGENTS[key].color,
    values,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    average: numbers.reduce((sum, value) => sum + value, 0) / numbers.length,
  }
})
