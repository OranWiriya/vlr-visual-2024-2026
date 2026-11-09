import fs from 'node:fs'
import Papa from 'papaparse'

function read(rel) {
  return Papa.parse(fs.readFileSync(`data/raw/${rel}`, 'utf8'), {
    header: true,
    skipEmptyLines: 'greedy',
  }).data
}
function num(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[%,]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

console.log('REGIONAL EVENT INTEGRITY (sum of event-level pick rates should be ~500%)')
for (const year of ['2024', '2025', '2026']) {
  const rows = read(`vct_${year}/agents/agents_pick_rates.csv`)
  const events = [
    ...new Set(
      rows
        .filter(
          (row) =>
            row.Stage === 'All Stages' &&
            row['Match Type'] === 'All Match Types' &&
            row.Map === 'All Maps',
        )
        .map((row) => row.Tournament),
    ),
  ]
  for (const event of events.sort()) {
    const rates = rows.filter(
      (row) =>
        row.Tournament === event &&
        row.Stage === 'All Stages' &&
        row['Match Type'] === 'All Match Types' &&
        row.Map === 'All Maps',
    )
    const sum = rates.reduce((s, r) => s + num(r['Pick Rate']), 0)
    const maps = read(`vct_${year}/matches/maps_scores.csv`).filter(
      (row) => row.Tournament === event,
    ).length
    const flag = sum < 400 || sum > 600 ? '  <-- CHECK' : ''
    console.log(
      `${year}  ${sum.toFixed(0).padStart(4)}%  ${String(maps).padStart(3)} maps  ${event}${flag}`,
    )
  }
}

console.log('\n2026 STAGE 1 — YORU BY STAGE / MATCH TYPE')
const rows2026 = read('vct_2026/agents/agents_pick_rates.csv')
for (const event of [
  'VCT 2026: Americas Stage 1',
  'VCT 2026: China Stage 1',
  'VCT 2026: EMEA Stage 1',
  'VCT 2026: Pacific Stage 1',
]) {
  const yoru = rows2026.filter(
    (row) =>
      row.Tournament === event &&
      row.Agent.toLowerCase() === 'yoru' &&
      row['Match Type'] === 'All Match Types' &&
      row.Map === 'All Maps',
  )
  console.log(`\n${event}`)
  console.log(yoru.map((r) => `${r.Stage}: ${r['Pick Rate']}`).join(' | '))
}

console.log('\nLONDON 2026 — teams_picked_agents rows')
const torontoRows = read('vct_2026/agents/teams_picked_agents.csv')
const londonTeam = torontoRows.filter(
  (row) => row.Tournament === 'Valorant Masters London 2026',
)
console.log('rows:', londonTeam.length)
console.log('stages:', [...new Set(londonTeam.map((r) => r.Stage))])
console.log('maps:', [...new Set(londonTeam.map((r) => r.Map))].slice(0, 12))

console.log('\nLONDON 2026 — reconstruct from overview.csv (player rows)')
const overview = read('vct_2026/matches/overview.csv').filter(
  (row) => row.Tournament === 'Valorant Masters London 2026',
)
console.log('overview rows:', overview.length)
console.log('maps:', [...new Set(overview.map((r) => r.Map))])
console.log('sample agents field:', overview.slice(0, 5).map((r) => r.Agents))
console.log('unique players:', new Set(overview.map((r) => r.Player)).size)
console.log('unique teams:', new Set(overview.map((r) => r.Team)).size)
