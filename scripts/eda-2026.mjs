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

const events = [
  ['2026', 'VCT 2026: Americas Kickoff'],
  ['2026', 'VCT 2026: Americas Stage 1'],
  ['2026', 'VCT 2026: China Kickoff'],
  ['2026', 'VCT 2026: China Stage 1'],
  ['2026', 'VCT 2026: EMEA Kickoff'],
  ['2026', 'VCT 2026: EMEA Stage 1'],
  ['2026', 'VCT 2026: Pacific Kickoff'],
  ['2026', 'VCT 2026: Pacific Stage 1'],
]

for (const [year, event] of events) {
  const rows = read(`vct_${year}/agents/agents_pick_rates.csv`).filter(
    (row) =>
      row.Tournament === event &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types' &&
      row.Map === 'All Maps',
  )
  const top = rows
    .map((r) => ({ agent: r.Agent, pick: num(r['Pick Rate']) }))
    .sort((a, b) => b.pick - a.pick)
    .slice(0, 12)
  const teams = [
    ...new Set(
      read(`vct_${year}/matches/scores.csv`)
        .filter((r) => r.Tournament === event)
        .flatMap((r) => [r['Team A'], r['Team B']]),
    ),
  ]
  const maps = read(`vct_${year}/matches/maps_scores.csv`).filter(
    (r) => r.Tournament === event,
  ).length
  console.log(`\n${event} — ${maps} maps, ${teams.length} teams`)
  console.log('teams:', teams.join(', '))
  console.log(top.map((r) => `${r.agent} ${r.pick}%`).join(' · '))
  const yoru = rows.find((r) => r.Agent.toLowerCase() === 'yoru')
  console.log('yoru row:', yoru ? JSON.stringify(yoru) : 'ABSENT')
}

console.log('\n2026 STAGE 1 — AGENT COUNT WITH ANY PICK')
for (const event of [
  'VCT 2026: Americas Stage 1',
  'VCT 2026: China Stage 1',
  'VCT 2026: EMEA Stage 1',
  'VCT 2026: Pacific Stage 1',
]) {
  const rows = read('vct_2026/agents/agents_pick_rates.csv').filter(
    (row) =>
      row.Tournament === event &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types' &&
      row.Map === 'All Maps',
  )
  console.log(
    event,
    'rows:',
    rows.length,
    'nonzero:',
    rows.filter((r) => num(r['Pick Rate']) > 0).length,
    'agents with 0%:',
    rows.filter((r) => num(r['Pick Rate']) === 0).length,
  )
}
