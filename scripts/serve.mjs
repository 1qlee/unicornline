// Minimal static server for previewing dist/ locally, resolving URLs the way
// Netlify does (directory -> index.html, unknown path -> 404.html).

import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "dist")
const PORT = Number(process.env.PORT ?? 8080)
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
}

async function resolveFile(urlPath) {
  const candidate = path.join(ROOT, decodeURIComponent(urlPath))
  if (!candidate.startsWith(ROOT)) return null
  const info = await stat(candidate).catch(() => null)
  if (info?.isDirectory()) return path.join(candidate, "index.html")
  if (info?.isFile()) return candidate
  const asDirectory = path.join(candidate, "index.html")
  return (await stat(asDirectory).catch(() => null)) ? asDirectory : null
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, "http://localhost")
  const file = await resolveFile(pathname)
  const target = file ?? path.join(ROOT, "404.html")
  try {
    const body = await readFile(target)
    response.writeHead(file ? 200 : 404, { "Content-Type": TYPES[path.extname(target)] ?? "application/octet-stream" })
    response.end(body)
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain" })
    response.end(`Could not read ${target}: ${error instanceof Error ? error.message : error}`)
  }
}).listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}`))
