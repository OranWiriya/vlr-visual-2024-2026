import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

function read(rel) {
  const file = path.join('data/raw', rel)
  return Papa.parse(fs.readFileSync(file, 'utf8'), {
    header: true,
    skipEmptyLines: 'greedy',
  }).data
}

function num(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[%,]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

for (const year of ['2024', '2025', '2026']) {
  const scores = read(`vct_${year}/matches/scores.csv`)
  const maps = read(`vct_${year}/matches/maps_scores.csv`)
  const events = new Map()

  for (const row of scores) {
    const name = row.Tournament
    if (!events.has(name)) events.set(name, { matches: 0, maps: 0 })
    events.get(name).matches += 1
  }
  for (const row of maps) {
    const name = row.Tournament
    if (!events.has(name)) events.set(name, { matches: 0, maps: 0 })
    events.get(name).maps += 1
  }

  console.log(`\n${year} — ${events.size} tournaments`)
  for (const [name, stats] of [...events].sort((a, b) => b[1].maps - a[1].maps)) {
    console.log(`  ${stats.maps.toString().padStart(4)} maps  ${stats.matches.toString().padStart(3)} matches  ${name}`)
  }
}

// Validate pick-rate formula against a known event: Masters Toronto 2025.
const toronto = read('vct_2025/agents/teams_picked_agents.csv').filter(
  (row) => row.Tournament === 'Valorant Masters Toronto 2025',
)
const ag = new Map()
let teamMapSlots = 0
const mapKeys = new Set()
for (const row of toronto) {
  const picks = num(row['Total Maps Played'])
  ag.set(row.Agent, (ag.get(row.Agent) ?? 0) + picks)
  teamMapSlots += picks
  mapKeys.add(`${row['Match Name']}::${row.Map}`)
}
const mapCount = mapKeys.size
console.log(`\nMasters Toronto 2025: ${mapCount} maps, ${teamMapSlots} team-agent picks`)
for (const [agent, picks] of [...ag].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  console.log(
    `  ${agent.padEnd(10)} picks=${picks.toString().padStart(3)}  share of team slots=${((picks / teamMapSlots) * 100).toFixed(1)}%  picks/maps=${((picks / mapCount) * 100).toFixed(1)}%`,
  )
}
