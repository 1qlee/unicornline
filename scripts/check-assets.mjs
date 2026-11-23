// Confirms every photo, PDF and ZIP the built pages point at exists on the asset
// host. Run after `npm run build`; it needs network access.

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const CONCURRENCY = 12

function assetUrlsIn(html, assetBaseUrl) {
  const decoded = html.replace(/&amp;/g, "&")
  const urls = [...decoded.matchAll(/https?:\/\/[^"\s,]+/g)].map((match) => match[0])
  const viewerKeys = [...decoded.matchAll(/\/viewer\/\?file=([^"&]+)/g)].map((match) => decodeURIComponent(match[1]))
  const viewerUrls = viewerKeys.map((key) => `${assetBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`)
  return [...urls, ...viewerUrls].filter((url) => url.startsWith(`${assetBaseUrl}/`))
}

async function main() {
  const config = JSON.parse(await readFile(path.join(ROOT, "site.config.json"), "utf8"))
  const dist = path.join(ROOT, "dist")
  const pages = (await readdir(dist, { recursive: true })).filter((file) => file.endsWith(".html"))

  const firstPageFor = new Map()
  for (const page of pages) {
    for (const url of assetUrlsIn(await readFile(path.join(dist, page), "utf8"), config.assetBaseUrl)) {
      if (!firstPageFor.has(url)) firstPageFor.set(url, page)
    }
  }

  const queue = [...firstPageFor.keys()]
  const missing = []
  async function worker() {
    while (queue.length) {
      const url = queue.pop()
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) missing.push(`${response.status} ${url} (linked from ${firstPageFor.get(url)})`)
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  if (missing.length) {
    console.error(`${missing.length} missing asset(s):\n  ${missing.join("\n  ")}`)
    process.exitCode = 1
    return
  }
  console.log(`${firstPageFor.size} asset URLs all exist`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
