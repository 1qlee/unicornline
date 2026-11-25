// Uploads every asset referenced from content/ that R2 doesn't already have.
// Usage: node --env-file=.env scripts/upload-assets.mjs <source-dir> [key-prefix]
// Keys are relative paths, so <source-dir>/<key> must exist for each referenced key.

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { createR2Client } from "./lib/r2.mjs"

const UPLOAD_CONCURRENCY = 4
const CACHE_CONTROL = "public, max-age=86400"
const CONTENT_TYPES = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
}

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const CONTENT_DIR = path.join(ROOT, "content")

export function collectAssetKeys(value, keys = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetKeys(item, keys))
  } else if (value && typeof value === "object") {
    if (typeof value.key === "string") keys.add(value.key)
    Object.values(value).forEach((item) => collectAssetKeys(item, keys))
  }
  return keys
}

export function contentTypeFor(key) {
  const type = CONTENT_TYPES[path.extname(key).toLowerCase()]
  if (!type) throw new Error(`No content type configured for ${key}`)
  return type
}

async function readContentFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true, recursive: true })
  const jsonFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  return Promise.all(
    jsonFiles.map(async (entry) => JSON.parse(await readFile(path.join(entry.parentPath, entry.name), "utf8"))),
  )
}

async function uploadIfMissing(r2, sourceDir, key) {
  const body = await readFile(path.join(sourceDir, key))
  const existing = await r2.headObject(key)
  if (existing && existing.size === body.length) return "skipped"
  await r2.putObject(key, body, { "Content-Type": contentTypeFor(key), "Cache-Control": CACHE_CONTROL })
  return "uploaded"
}

async function runWithConcurrency(items, limit, task) {
  const results = []
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await task(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function main() {
  const [sourceDir, prefix = ""] = process.argv.slice(2)
  if (!sourceDir) throw new Error("Usage: upload-assets.mjs <source-dir> [key-prefix]")

  const r2 = createR2Client(process.env)
  const documents = await readContentFiles(CONTENT_DIR)
  const keys = [...collectAssetKeys(documents)].filter((key) => key.startsWith(prefix)).sort()

  const outcomes = await runWithConcurrency(keys, UPLOAD_CONCURRENCY, async (key) => {
    try {
      return await uploadIfMissing(r2, path.resolve(sourceDir), key)
    } catch (error) {
      throw new Error(`Failed on ${key}: ${error instanceof Error ? error.message : error}`)
    }
  })
  const uploaded = outcomes.filter((outcome) => outcome === "uploaded").length
  console.log(`${keys.length} referenced keys under "${prefix}": ${uploaded} uploaded, ${keys.length - uploaded} already in R2`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
