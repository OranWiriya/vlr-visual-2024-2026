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

console.log('MASTERS LONDON 2026 — agents_pick_rates shape')
const london = read('vct_2026/agents/agents_pick_rates.csv').filter(
  (row) => row.Tournament === 'Valorant Masters London 2026',
)
console.log('rows:', london.length)
console.log('stages:', [...new Set(london.map((r) => r.Stage))])
console.log('match types:', [...new Set(london.map((r) => r['Match Type']))])
console.log('maps:', [...new Set(london.map((r) => r.Map))])
console.log('sample:', london.slice(0, 8))

console.log('\nMASTERS SANTIAGO 2026 — aggregate row check')
const santiago = read('vct_2026/agents/agents_pick_rates.csv').filter(
  (row) =>
    row.Tournament === 'Valorant Masters Santiago 2026' &&
    row.Stage === 'All Stages' &&
    row['Match Type'] === 'All Match Types' &&
    row.Map === 'All Maps',
)
console.log('rows:', santiago.length)

console.log('\nINTERNATIONAL AGENT WIN RATES (aggregate team-map rows)')
const EVENTS = [
  ['2024', 'Champions Tour 2024: Masters Madrid'],
  ['2024', 'Champions Tour 2024: Masters Shanghai'],
  ['2024', 'Valorant Champions 2024'],
  ['2025', 'Valorant Masters Bangkok 2025'],
  ['2025', 'Valorant Masters Toronto 2025'],
  ['2025', 'Valorant Champions 2025'],
  ['2026', 'Valorant Masters Santiago 2026'],
  ['2026', 'Valorant Masters London 2026'],
]
for (const [year, event] of EVENTS) {
  const rows = read(`vct_${year}/agents/teams_picked_agents.csv`).filter(
    (row) =>
      row.Tournament === event &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types',
  )
  const agents = new Map()
  for (const row of rows) {
    const key = row.Agent.toLowerCase()
    if (!agents.has(key)) agents.set(key, { wins: 0, losses: 0, maps: 0 })
    const entry = agents.get(key)
    entry.wins += num(row['Total Wins By Map'])
    entry.losses += num(row['Total Loss By Map'])
    entry.maps += num(row['Total Maps Played'])
  }
  const ranked = [...agents]
    .filter(([, v]) => v.maps >= 5)
    .map(([agent, v]) => ({ agent, ...v, winRate: v.wins / (v.wins + v.losses) }))
    .sort((a, b) => b.maps - a.maps)
  console.log(`\n${event} (${rows.length} aggregate rows)`)
  console.log(
    ranked
      .slice(0, 8)
      .map((r) => `${r.agent} ${(r.winRate * 100).toFixed(1)}% (${r.maps})`)
      .join(' · '),
  )
}

console.log('\nYORU BY EVENT (pick rate, win rate)')
for (const [year, event] of EVENTS) {
  const pickRows = read(`vct_${year}/agents/agents_pick_rates.csv`).filter(
    (row) =>
      row.Tournament === event &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types' &&
      row.Map === 'All Maps',
  )
  const pick = pickRows.find((row) => row.Agent.toLowerCase() === 'yoru')
  const teamRows = read(`vct_${year}/agents/teams_picked_agents.csv`).filter(
    (row) =>
      row.Tournament === event &&
      row.Stage === 'All Stages' &&
      row['Match Type'] === 'All Match Types' &&
      row.Agent.toLowerCase() === 'yoru',
  )
  const wins = teamRows.reduce((s, r) => s + num(r['Total Wins By Map']), 0)
  const losses = teamRows.reduce((s, r) => s + num(r['Total Loss By Map']), 0)
  console.log(
    event.padEnd(42),
    `pick ${pick ? pick['Pick Rate'] : 'n/a'.padStart(4)}`,
    `win ${wins + losses ? ((wins / (wins + losses)) * 100).toFixed(1) : 'n/a'}%`,
    `maps ${wins + losses}`,
  )
}

console.log('\nREGIONAL EVENTS — YORU / OMEN / VIPER / JETT pick rates')
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
  ].filter((name) => !/Masters|^Valorant Champions/.test(name))
  for (const event of events.sort()) {
    const rate = (agent) => {
      const hit = rows.find(
        (row) =>
          row.Tournament === event &&
          row.Stage === 'All Stages' &&
          row['Match Type'] === 'All Match Types' &&
          row.Map === 'All Maps' &&
          row.Agent.toLowerCase() === agent,
      )
      return hit ? hit['Pick Rate'].padStart(4) : '   -'
    }
    console.log(
      event.padEnd(42),
      `yoru ${rate('yoru')}`,
      `omen ${rate('omen')}`,
      `viper ${rate('viper')}`,
      `jett ${rate('jett')}`,
    )
  }
}
