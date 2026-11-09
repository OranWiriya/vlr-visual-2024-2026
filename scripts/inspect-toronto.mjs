import fs from 'node:fs'
import Papa from 'papaparse'

function read(rel) {
  return Papa.parse(fs.readFileSync(`data/raw/${rel}`, 'utf8'), {
    header: true,
    skipEmptyLines: 'greedy',
  }).data
}

const rows = read('vct_2025/agents/teams_picked_agents.csv').filter(
  (row) => row.Tournament === 'Valorant Masters Toronto 2025',
)
console.log('rows:', rows.length)
console.log('sample rows:')
console.log(rows.slice(0, 10))
console.log('\nunique Map values:', [...new Set(rows.map((r) => r.Map))])
console.log('unique stages:', [...new Set(rows.map((r) => r.Stage))])
console.log('unique match types:', [...new Set(rows.map((r) => r['Match Type']))])
console.log('unique match names:', [...new Set(rows.map((r) => r['Match Name']))].slice(0, 10))
console.log('unique teams:', [...new Set(rows.map((r) => r.Team))].length)

const pickRates = read('vct_2025/agents/agents_pick_rates.csv').filter(
  (row) => row.Tournament === 'Valorant Masters Toronto 2025',
)
console.log('\nagents_pick_rates rows:', pickRates.length)
console.log('unique Map values:', [...new Set(pickRates.map((r) => r.Map))])
console.log('unique stages:', [...new Set(pickRates.map((r) => r.Stage))])
console.log('sample:')
console.log(pickRates.slice(0, 12))
