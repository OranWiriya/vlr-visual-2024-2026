import fs from 'node:fs'
import Papa from 'papaparse'

function read(rel) {
  return Papa.parse(fs.readFileSync(`data/raw/${rel}`, 'utf8'), {
    header: true,
    skipEmptyLines: 'greedy',
  }).data
}

function agentPickRatesFromOverview(year, event) {
  const rows = read(`vct_${year}/matches/overview.csv`).filter(
    (row) => row.Tournament === event && row.Map !== 'All Maps',
  )
  const mapKeys = new Set()
  const playerKeys = new Map()
  for (const row of rows) {
    mapKeys.add(`${row['Match Name']}|${row.Map}`)
    const key = `${row['Match Name']}|${row.Map}|${row.Team}|${row.Player}`
    playerKeys.set(key, {
      agent: String(row.Agents ?? '').split(',')[0].trim().toLowerCase(),
      team: row.Team,
      map: row.Map,
    })
  }
  const counts = new Map()
  for (const { agent } of playerKeys.values()) {
    if (!agent) continue
    counts.set(agent, (counts.get(agent) ?? 0) + 1)
  }
  const totalPicks = [...counts.values()].reduce((s, n) => s + n, 0)
  return {
    maps: mapKeys.size,
    rows: rows.length,
    uniquePlayerMaps: playerKeys.size,
    totalPicks,
    expectedPicks: mapKeys.size * 10,
    rates: [...counts]
      .map(([agent, picks]) => ({
        agent,
        picks,
        pick: (picks / (mapKeys.size * 2)) * 100,
      }))
      .sort((a, b) => b.picks - a.picks),
  }
}

for (const [year, event] of [
  ['2026', 'Valorant Masters Santiago 2026'],
  ['2026', 'Valorant Masters London 2026'],
]) {
  const result = agentPickRatesFromOverview(year, event)
  console.log(`\n${event}`)
  console.log(
    `maps=${result.maps} overviewRows=${result.rows} uniquePlayerMaps=${result.uniquePlayerMaps} picks=${result.totalPicks} expected=${result.expectedPicks}`,
  )
  console.log(
    result.rates
      .slice(0, 12)
      .map((r) => `${r.agent} ${r.pick.toFixed(1)}%`)
      .join(' · '),
  )
}
