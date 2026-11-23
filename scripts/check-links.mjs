// Fails if any page in dist/ links to an internal page, file or #anchor that
// doesn't exist. External links (R2 assets, YouTube, main site) are not checked.

import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "dist")
const LINK_PATTERN = /\s(?:href|src)="([^"]+)"/g

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

async function targetFile(urlPath) {
  const candidate = path.join(ROOT, decodeURIComponent(urlPath))
  const info = await stat(candidate).catch(() => null)
  if (info?.isFile()) return candidate
  const index = path.join(candidate, "index.html")
  return (await stat(index).catch(() => null)) ? index : null
}

async function main() {
  const entries = await readdir(ROOT, { recursive: true })
  const pages = entries.filter((entry) => entry.endsWith(".html"))
  const idCache = new Map()
  const problems = []
  let checked = 0

  async function idsIn(file) {
    if (!idCache.has(file)) {
      const html = await readFile(file, "utf8")
      idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])))
    }
    return idCache.get(file)
  }

  for (const page of pages) {
    const pagePath = "/" + page.replace(/index\.html$/, "")
    const html = await readFile(path.join(ROOT, page), "utf8")
    for (const [, raw] of html.matchAll(LINK_PATTERN)) {
      const link = decodeEntities(raw)
      if (/^(https?:|tel:|mailto:)/.test(link)) continue
      checked++
      const url = new URL(link, `http://site${pagePath}`)
      const file = await targetFile(url.pathname)
      if (!file) {
        problems.push(`${page}: ${link} -> no such page or file`)
        continue
      }
      const fragment = url.hash.slice(1)
      if (fragment && file.endsWith(".html") && !(await idsIn(file)).has(decodeURIComponent(fragment))) {
        problems.push(`${page}: ${link} -> no element with id "${fragment}"`)
      }
    }
  }

  if (problems.length) {
    console.error(`${problems.length} broken internal link(s):\n  ${problems.join("\n  ")}`)
    process.exitCode = 1
    return
  }
  console.log(`${checked} internal links in ${pages.length} pages all resolve`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
