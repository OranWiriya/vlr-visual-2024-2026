import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const cache = new Map()
function read(rel) {
  if (cache.has(rel)) return cache.get(rel)
  const rows = Papa.parse(fs.readFileSync(path.join('data/raw', rel), 'utf8'), {
    header: true,
    skipEmptyLines: 'greedy',
  }).data
  cache.set(rel, rows)
  return rows
}
function num(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[%,]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const EVENTS = [
  { id: 'madrid-2024', label: 'Masters Madrid', year: '2024', date: '2024-03', tournament: 'Champions Tour 2024: Masters Madrid' },
  { id: 'shanghai-2024', label: 'Masters Shanghai', year: '2024', date: '2024-06', tournament: 'Champions Tour 2024: Masters Shanghai' },
  { id: 'champions-2024', label: 'Champions 2024', year: '2024', date: '2024-08', tournament: 'Valorant Champions 2024' },
  { id: 'bangkok-2025', label: 'Masters Bangkok', year: '2025', date: '2025-03', tournament: 'Valorant Masters Bangkok 2025' },
  { id: 'toronto-2025', label: 'Masters Toronto', year: '2025', date: '2025-06', tournament: 'Valorant Masters Toronto 2025' },
  { id: 'champions-2025', label: 'Champions 2025', year: '2025', date: '2025-10', tournament: 'Valorant Champions 2025' },
  { id: 'santiago-2026', label: 'Masters Santiago', year: '2026', date: '2026-03', tournament: 'Valorant Masters Santiago 2026' },
  { id: 'london-2026', label: 'Masters London', year: '2026', date: '2026-06', tournament: 'Valorant Masters London 2026' },
]

function aggregateRows(year, tournament) {
  return read(`vct_${year}/agents/agents_pick_rates.csv`).filter(
    (row) =>
      row.Tournament === tournament &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types' &&
      row.Map === 'All Maps',
  )
}

function overviewRates(year, tournament) {
  const rows = read(`vct_${year}/matches/overview.csv`).filter(
    (row) => row.Tournament === tournament && row.Map !== 'All Maps',
  )
  const maps = new Set()
  const players = new Map()
  for (const row of rows) {
    maps.add(`${row['Match Name']}|${row.Map}`)
    players.set(
      `${row['Match Name']}|${row.Map}|${row.Team}|${row.Player}`,
      String(row.Agents ?? '').split(',')[0].trim().toLowerCase(),
    )
  }
  const counts = new Map()
  for (const agent of players.values()) {
    if (agent) counts.set(agent, (counts.get(agent) ?? 0) + 1)
  }
  return Object.fromEntries(
    [...counts].map(([agent, picks]) => [agent, (picks / (maps.size * 2)) * 100]),
  )
}

function mapCount(year, tournament) {
  return read(`vct_${year}/matches/maps_scores.csv`).filter(
    (row) => row.Tournament === tournament,
  ).length
}

const events = EVENTS.map((event) => {
  const rates =
    event.id === 'london-2026'
      ? overviewRates(event.year, event.tournament)
      : Object.fromEntries(
          aggregateRows(event.year, event.tournament).map((row) => [
            row.Agent.toLowerCase(),
            num(row['Pick Rate']),
          ]),
        )
  return {
    ...event,
    maps: mapCount(event.year, event.tournament),
    source: event.id === 'london-2026' ? 'overview' : 'agents_pick_rates',
    rates,
  }
})

// Regional snapshots for 2026 Kickoff and Stage 1, weighted by maps.
const REGIONS = ['Americas', 'China', 'EMEA', 'Pacific']
function regionalSnapshot(year, stage) {
  const events = REGIONS.map((region) => `VCT ${year}: ${region} ${stage}`)
  const totals = new Map()
  let mapsTotal = 0
  const detail = []
  for (const tournament of events) {
    const maps = mapCount(year, tournament)
    mapsTotal += maps
    const rates = Object.fromEntries(
      aggregateRows(year, tournament).map((row) => [
        row.Agent.toLowerCase(),
        num(row['Pick Rate']),
      ]),
    )
    detail.push({ tournament, maps, rates })
    for (const [agent, rate] of Object.entries(rates)) {
      totals.set(agent, (totals.get(agent) ?? 0) + rate * maps)
    }
  }
  return {
    maps: mapsTotal,
    rates: Object.fromEntries(
      [...totals].map(([agent, weighted]) => [agent, weighted / mapsTotal]),
    ),
    detail,
  }
}

const kickoff2026 = regionalSnapshot('2026', 'Kickoff')
const stage1_2026 = regionalSnapshot('2026', 'Stage 1')

console.log('CONSOLIDATED EVENT PICK RATES')
console.log('='.repeat(90))
const KEY_AGENTS = ['tejo', 'yoru', 'neon', 'omen', 'viper', 'sova', 'jett', 'raze', 'waylay', 'vyse']
console.log(
  'event'.padEnd(20),
  'maps'.padStart(4),
  ...KEY_AGENTS.map((a) => a.slice(0, 5).padStart(6)),
)
for (const event of events) {
  console.log(
    event.label.padEnd(20),
    String(event.maps).padStart(4),
    ...KEY_AGENTS.map((agent) =>
      `${(event.rates[agent] ?? 0).toFixed(0)}%`.padStart(6),
    ),
  )
}
console.log(
  '2026 Kickoff (reg)'.padEnd(20),
  String(kickoff2026.maps).padStart(4),
  ...KEY_AGENTS.map((agent) =>
    `${(kickoff2026.rates[agent] ?? 0).toFixed(0)}%`.padStart(6),
  ),
)
console.log(
  '2026 Stage 1 (reg)'.padEnd(20),
  String(stage1_2026.maps).padStart(4),
  ...KEY_AGENTS.map((agent) =>
    `${(stage1_2026.rates[agent] ?? 0).toFixed(0)}%`.padStart(6),
  ),
)

console.log('\nCASE BEFORE/AFTER')
const cases = [
  {
    agent: 'tejo',
    before: ['bangkok-2025', 56],
    after: ['toronto-2025', 4],
    patch: '10.09',
  },
  {
    agent: 'yoru',
    before: ['santiago-2026', 62],
    after: ['london-2026', 0],
    patch: '12.05',
  },
  {
    agent: 'neon',
    before: ['stage1-2026', 80],
    after: ['london-2026', 32],
    patch: '12.09',
  },
]
for (const entry of cases) {
  const beforeValue =
    entry.before[0] === 'stage1-2026'
      ? stage1_2026.rates[entry.agent]
      : events.find((e) => e.id === entry.before[0]).rates[entry.agent]
  const afterValue =
    entry.after[0] === 'stage1-2026'
      ? stage1_2026.rates[entry.agent]
      : events.find((e) => e.id === entry.after[0]).rates[entry.agent]
  console.log(
    `${entry.agent.padEnd(7)} patch ${entry.patch}: ${beforeValue.toFixed(1)}% -> ${afterValue.toFixed(1)}%  (${entry.before[0]} -> ${entry.after[0]})`,
  )
}

console.log('\n2026 STAGE 1 BY REGION')
for (const region of stage1_2026.detail) {
  console.log(
    region.tournament.padEnd(30),
    `yoru ${region.rates.yoru?.toFixed(1)}%`,
    `neon ${region.rates.neon?.toFixed(1)}%`,
    `omen ${region.rates.omen?.toFixed(1)}%`,
  )
}

console.log('\nCONSTANTS: range across international events')
for (const agent of ['omen', 'viper', 'sova']) {
  const values = events.map((event) => event.rates[agent] ?? 0)
  console.log(
    agent.padEnd(8),
    `min ${Math.min(...values).toFixed(0)}%  max ${Math.max(...values).toFixed(0)}%  avg ${(values.reduce((s, v) => s + v, 0) / values.length).toFixed(1)}%`,
  )
}

const payload = {
  generatedAt: new Date().toISOString(),
  events,
  snapshots: {
    kickoff2026,
    stage1_2026,
  },
}

fs.mkdirSync('data/processed', { recursive: true })
fs.mkdirSync('src/data', { recursive: true })
const serialized = JSON.stringify(payload, null, 2)
fs.writeFileSync('data/processed/story-data.json', serialized)
fs.writeFileSync('src/data/story.json', serialized)
console.log('\nWrote data/processed/story-data.json and src/data/story.json')
