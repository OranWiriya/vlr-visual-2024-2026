import { spawn } from 'node:child_process'
import fs from 'node:fs'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const port = 9333
const userData = 'C:/Users/ORAN/AppData/Local/Temp/opencode/chrome-cdp'
const targetUrl = process.argv[2] ?? 'http://localhost:5199/'
const selector = process.argv[3] ?? ''
const out = process.argv[4] ?? '.shots/shot.png'
const width = Number(process.argv[5] ?? 1440)
const height = Number(process.argv[6] ?? 1200)

const child = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userData}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
)

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getJson(url) {
  const res = await fetch(url)
  return res.json()
}

let pageWs
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    const pages = await getJson(`http://127.0.0.1:${port}/json/list`)
    const page = pages.find((entry) => entry.type === 'page')
    if (page?.webSocketDebuggerUrl) {
      pageWs = page.webSocketDebuggerUrl
      break
    }
  } catch {
    // Chrome is still starting.
  }
  await wait(250)
}

if (!pageWs) {
  child.kill()
  throw new Error('Could not connect to Chrome DevTools')
}

const ws = new WebSocket(pageWs)
await new Promise((resolve, reject) => {
  ws.onopen = resolve
  ws.onerror = reject
})

let nextId = 0
const pending = new Map()
ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message)
    pending.delete(message.id)
  }
}

function send(method, params = {}) {
  const id = ++nextId
  return new Promise((resolve, reject) => {
    pending.set(id, (message) => {
      if (message.error) reject(new Error(JSON.stringify(message.error)))
      else resolve(message.result)
    })
    ws.send(JSON.stringify({ id, method, params }))
  })
}

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: false,
})
await send('Page.navigate', { url: targetUrl })
await wait(2500)

if (selector) {
  await send('Runtime.evaluate', {
    expression: `(() => {
      const node = document.querySelector(${JSON.stringify(selector)})
      if (!node) return 'missing'
      const top = node.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'instant' })
      return String(top)
    })()`,
    returnByValue: true,
  })
  await wait(1800)
}

const metrics = await send('Runtime.evaluate', {
  expression:
    'JSON.stringify({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, bodyScrollWidth: document.body.scrollWidth })',
  returnByValue: true,
})
console.log(metrics.result.value)

const shot = await send('Page.captureScreenshot', { format: 'png' })
fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))

ws.close()
child.kill()
console.log(`wrote ${out}`)
