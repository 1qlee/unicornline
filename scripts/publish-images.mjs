// Makes WebP variants of every product photo and uploads any R2 doesn't have yet.
// Usage: node --env-file=.env scripts/publish-images.mjs <originals-dir>
// <originals-dir>/<key> must hold the original for each image key in content/products.

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { loadContent } from "../src/content.mjs"
import { variantKey, widthsFor } from "../src/images.mjs"
import { createR2Client } from "./lib/r2.mjs"

const WEBP_QUALITY = 82
const CONCURRENCY = 4
const CACHE_CONTROL = "public, max-age=31536000, immutable"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const CACHE_DIR = path.join(ROOT, ".export", "variants")

function collectImages(products) {
  const byKey = new Map()
  for (const { data } of products) {
    for (const image of [data.thumbnail, ...data.images]) byKey.set(image.key, image)
  }
  return [...byKey.values()]
}

async function renderVariant(originalPath, width, cachePath) {
  const cached = await readFile(cachePath).catch(() => null)
  if (cached) return cached
  const bytes = await sharp(originalPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  await mkdir(path.dirname(cachePath), { recursive: true })
  await writeFile(cachePath, bytes)
  return bytes
}

async function publishImage(r2, originalsDir, image) {
  let uploaded = 0
  for (const width of widthsFor(image)) {
    const key = variantKey(image.key, width)
    const bytes = await renderVariant(path.join(originalsDir, image.key), width, path.join(CACHE_DIR, key))
    const existing = await r2.headObject(key)
    if (existing && existing.size === bytes.length) continue
    await r2.putObject(key, bytes, { "Content-Type": "image/webp", "Cache-Control": CACHE_CONTROL })
    uploaded++
  }
  return uploaded
}

async function main() {
  const [originalsDir] = process.argv.slice(2)
  if (!originalsDir) throw new Error("Usage: publish-images.mjs <originals-dir>")

  const r2 = createR2Client(process.env)
  const images = collectImages((await loadContent(path.join(ROOT, "content"))).products)

  let next = 0
  let uploaded = 0
  async function worker() {
    while (next < images.length) {
      const image = images[next++]
      try {
        uploaded += await publishImage(r2, path.resolve(originalsDir), image)
      } catch (error) {
        throw new Error(`Failed on ${image.key}: ${error instanceof Error ? error.message : error}`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  console.log(`${images.length} photos checked, ${uploaded} variants uploaded`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
