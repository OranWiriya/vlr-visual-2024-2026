import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const YEARS = ['2024', '2025', '2026']
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

const EVENT_ORDER = [
  'Champions Tour 2024: Masters Madrid',
  'Champions Tour 2024: Masters Shanghai',
  'Valorant Champions 2024',
  'Valorant Masters Bangkok 2025',
  'Valorant Masters Toronto 2025',
  'Valorant Champions 2025',
  'Valorant Masters Santiago 2026',
  'Valorant Masters London 2026',
]

function eventPickRates(year, eventName) {
  const rows = read(`vct_${year}/agents/agents_pick_rates.csv`).filter(
    (row) =>
      row.Tournament === eventName &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types' &&
      row.Map === 'All Maps',
  )
  return rows
    .map((row) => ({ agent: row.Agent.toLowerCase(), pick: num(row['Pick Rate']) }))
    .filter((row) => row.pick > 0)
    .sort((a, b) => b.pick - a.pick)
}

function eventMapCount(year, eventName) {
  return read(`vct_${year}/matches/maps_scores.csv`).filter(
    (row) => row.Tournament === eventName,
  ).length
}

const events = EVENT_ORDER.map((name) => {
  const year = name.match(/20\d{2}/)[0]
  const rates = eventPickRates(year, name)
  const total = rates.reduce((sum, row) => sum + row.pick, 0)
  const shares = rates.map((row) => row.pick / total)
  const hhi = shares.reduce((sum, share) => sum + share ** 2, 0)
  return {
    name,
    year,
    maps: eventMapCount(year, name),
    rates,
    total,
    top5: rates.slice(0, 5).reduce((sum, row) => sum + row.pick, 0),
    top10: rates.slice(0, 10).reduce((sum, row) => sum + row.pick, 0),
    hhi,
    agentsOver5: rates.filter((row) => row.pick / total >= 0.05).length,
  }
})

console.log('INTERNATIONAL EVENT OVERVIEW')
console.log('='.repeat(100))
console.log(
  'event'.padEnd(42),
  'maps'.padStart(5),
  'agents'.padStart(7),
  'top5%'.padStart(7),
  'top10%'.padStart(7),
  'HHI'.padStart(7),
  '>5%'.padStart(5),
  'leader',
)
for (const event of events) {
  console.log(
    event.name.padEnd(42),
    String(event.maps).padStart(5),
    String(event.rates.length).padStart(7),
    `${event.top5.toFixed(1)}%`.padStart(7),
    `${event.top10.toFixed(1)}%`.padStart(7),
    event.hhi.toFixed(3).padStart(7),
    String(event.agentsOver5).padStart(5),
    `${event.rates[0]?.agent} ${event.rates[0]?.pick}%`,
  )
}

console.log('\nTOP 12 AGENTS PER EVENT (% of team slots)')
console.log('='.repeat(100))
const allAgents = [...new Set(events.flatMap((e) => e.rates.map((r) => r.agent)))]
for (const event of events) {
  console.log(`\n${event.name}`)
  console.log(
    event.rates
      .slice(0, 12)
      .map((r) => `${r.agent} ${r.pick}%`)
      .join(' · '),
  )
}

console.log('\nAGENT TRAJECTORIES (events where pick rate >= 5%)')
console.log('='.repeat(100))
const rows = []
for (const agent of allAgents) {
  const series = events.map(
    (event) => event.rates.find((r) => r.agent === agent)?.pick ?? 0,
  )
  const peaks = Math.max(...series)
  if (peaks < 10) continue
  rows.push({ agent, series, peaks })
}
rows.sort((a, b) => b.peaks - a.peaks)
for (const row of rows) {
  console.log(
    row.agent.padEnd(12),
    row.series.map((v) => String(v).padStart(4)).join(''),
  )
}

console.log('\nAGENTS SEEN PER YEAR')
console.log('='.repeat(100))
for (const year of YEARS) {
  const agents = new Set()
  for (const rel of ['agents/agents_pick_rates.csv']) {
    for (const row of read(`vct_${year}/${rel}`)) {
      if (row.Agent) agents.add(row.Agent.toLowerCase())
    }
  }
  console.log(year, `(${agents.size}):`, [...agents].sort().join(', '))
}

console.log('\nTORONTO CHECK')
const toronto = events.find((e) => e.name === 'Valorant Masters Toronto 2025')
console.log(toronto.rates.slice(0, 6))
