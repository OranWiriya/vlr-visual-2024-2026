import fs from 'node:fs'
import path from 'node:path'
import Papa from 'papaparse'

const ROOT = path.resolve('data/raw')
const MAX_FULL_PARSE_BYTES = 40 * 1024 * 1024

function walk(dir, depth = 0, maxDepth = 6) {
  const out = { dirs: [], files: [] }
  if (depth > maxDepth) return out

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.dirs.push(full)
      const nested = walk(full, depth + 1, maxDepth)
      out.dirs.push(...nested.dirs)
      out.files.push(...nested.files)
    } else {
      out.files.push(full)
    }
  }

  return out
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

function parseCsv(file, previewOnly) {
  const text = fs.readFileSync(file, 'utf8')
  return Papa.parse(text, {
    header: true,
    skipEmptyLines: 'greedy',
    preview: previewOnly ? 5 : undefined,
  })
}

if (!fs.existsSync(ROOT)) {
  console.log('data/raw does not exist. Create it and drop the Kaggle folders in.')
  process.exit(0)
}

const { dirs, files } = walk(ROOT)
const csvs = files.filter((f) => f.toLowerCase().endsWith('.csv'))

console.log(`\nRAW DATA TREE\n${'='.repeat(60)}`)
console.log(
  dirs
    .map((d) => path.relative(ROOT, d).replaceAll('\\', '/'))
    .sort()
    .map((d) => `  ${d}/`)
    .join('\n') || '  (no subfolders)',
)

console.log(`\nCSV FILES (${csvs.length})\n${'='.repeat(60)}`)
for (const file of csvs.sort()) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/')
  const size = fs.statSync(file).size
  console.log(`\n${rel}  [${humanSize(size)}]`)

  if (size > MAX_FULL_PARSE_BYTES) {
    console.log('  (large file — preview only)')
  }

  try {
    const result = parseCsv(file, size > MAX_FULL_PARSE_BYTES)
    const fields = result.meta?.fields ?? []
    console.log(`  columns: ${fields.join(', ')}`)
    if (result.data.length) {
      console.log(`  sample: ${JSON.stringify(result.data[0])}`)
    }
    if (!result.meta?.aborted && size <= MAX_FULL_PARSE_BYTES) {
      console.log(`  rows: ${result.data.length}`)
    }
  } catch (error) {
    console.log(`  could not parse: ${error.message}`)
  }
}

const agentFiles = csvs.filter((f) => /agent/i.test(path.basename(f)))
if (agentFiles.length) {
  console.log(`\nAGENT-RELATED FILES\n${'='.repeat(60)}`)
  for (const file of agentFiles) {
    console.log(`  ${path.relative(ROOT, file).replaceAll('\\', '/')}`)
  }
}

console.log('\nDone.\n')
