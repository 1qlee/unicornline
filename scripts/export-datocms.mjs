// One-off migration: pulls the published DatoCMS content into content/*.json and
// downloads every referenced upload into .export/assets/ for the R2 upload step.
// Delete this script once the migration is verified; DatoCMS is being retired.

import { mkdir, writeFile, stat } from "node:fs/promises"
import path from "node:path"

const GRAPHQL_ENDPOINT = "https://graphql.datocms.com/"
const MAX_RECORDS_PER_QUERY = 100
const DOWNLOAD_CONCURRENCY = 6
const PRINT_METHODS = ["digital", "offset", "inkjet"]

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const CONTENT_DIR = path.join(ROOT, "content")
const EXPORT_DIR = path.join(ROOT, ".export")
const ASSET_DIR = path.join(EXPORT_DIR, "assets")

const UPLOAD_FIELDS = "id url filename size width height alt title"

const QUERY = `{
  _allProductsMeta { count }
  _allCategoriesMeta { count }
  _allBannerproductsMeta { count }
  company {
    company blurb about address email phone map
    logo { ${UPLOAD_FIELDS} }
    logoLine { ${UPLOAD_FIELDS} }
    terms { ${UPLOAD_FIELDS} }
  }
  allCategories(first: ${MAX_RECORDS_PER_QUERY}, orderBy: name_ASC) {
    name slug description
    photo { ${UPLOAD_FIELDS} }
  }
  allBannerproducts(first: ${MAX_RECORDS_PER_QUERY}, orderBy: name_ASC) {
    name description slug
    image { ${UPLOAD_FIELDS} }
  }
  allProducts(first: ${MAX_RECORDS_PER_QUERY}, orderBy: name_ASC) {
    name slug category description
    helper(markdown: true)
    specs pricing videos
    thumbnail { ${UPLOAD_FIELDS} }
    images { ${UPLOAD_FIELDS} }
    template { ${UPLOAD_FIELDS} }
    catalogPage { ${UPLOAD_FIELDS} }
    fullCatalog { ${UPLOAD_FIELDS} }
  }
}`

// ---------- edges: network ----------

async function fetchDatoContent(token) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY }),
  })
  if (!response.ok) {
    throw new Error(`DatoCMS GraphQL request failed: ${response.status} ${await response.text()}`)
  }
  const body = await response.json()
  if (body.errors) {
    throw new Error(`DatoCMS GraphQL errors: ${JSON.stringify(body.errors)}`)
  }
  return body.data
}

async function downloadAsset(asset) {
  const destination = path.join(ASSET_DIR, asset.key)
  const existing = await stat(destination).catch(() => null)
  if (existing && existing.size === asset.size) return "skipped"

  const response = await fetch(asset.url)
  if (!response.ok) {
    throw new Error(`Download failed for ${asset.url}: ${response.status}`)
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  if (bytes.length !== asset.size) {
    throw new Error(`Size mismatch for ${asset.url}: expected ${asset.size}, got ${bytes.length}`)
  }
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, bytes)
  return "downloaded"
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

// ---------- pure transforms ----------

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// The Gatsby site built product URLs from the category *name*, not its slug.
function legacyCategorySegment(categoryName) {
  return categoryName.toLowerCase().split(" ").join("-")
}

function assertCountsFit(data) {
  const counts = {
    products: data._allProductsMeta.count,
    categories: data._allCategoriesMeta.count,
    banners: data._allBannerproductsMeta.count,
  }
  for (const [name, count] of Object.entries(counts)) {
    if (count > MAX_RECORDS_PER_QUERY) {
      throw new Error(`${count} ${name} exceed the ${MAX_RECORDS_PER_QUERY}-record query limit; add pagination`)
    }
  }
}

// Collects every upload once, giving each a stable, readable storage key.
function createAssetRegistry() {
  const byId = new Map()
  const usedKeys = new Set()

  function register(upload, folder) {
    if (!upload) return null
    const known = byId.get(upload.id)
    if (known) return known.key

    const { name, ext } = path.parse(upload.filename)
    let key = `${folder}/${slugify(name)}${ext.toLowerCase()}`
    if (usedKeys.has(key)) key = `${folder}/${slugify(name)}-${upload.id}${ext.toLowerCase()}`
    usedKeys.add(key)
    byId.set(upload.id, { key, url: upload.url, size: upload.size })
    return key
  }

  return { register, list: () => [...byId.values()] }
}

function toImage(upload, folder, registry, fallbackAlt) {
  if (!upload) return null
  return {
    key: registry.register(upload, folder),
    alt: upload.alt || fallbackAlt,
    width: upload.width,
    height: upload.height,
  }
}

function toFile(upload, folder, registry) {
  if (!upload) return null
  return { key: registry.register(upload, folder), bytes: upload.size }
}

export function normalizePricing(pricing) {
  const methodPattern = new RegExp(`^(${PRINT_METHODS.join("|")})(.*)$`)
  return {
    legend: pricing.legend ?? [],
    columns: (pricing.headings ?? []).map((heading) => {
      const match = heading.match(methodPattern)
      return match ? { label: match[2], method: match[1] } : { label: heading, method: null }
    }),
    rows: pricing.values ?? [],
  }
}

function normalizeSpecs(specs) {
  return {
    features: specs.list ?? [],
    materials: specs.material ?? [],
    printing: specs.printing ?? [],
    options: specs.option ?? [],
    customShape: specs.custom ?? null,
  }
}

function resolveCategorySlugs(rawCategory, categories) {
  return rawCategory.split(",").map((part) => {
    const name = part.trim().toLowerCase()
    const match = categories.find((category) => category.name.toLowerCase() === name)
    if (!match) throw new Error(`Unknown category "${part.trim()}" in "${rawCategory}"`)
    return match.slug
  })
}

function toProduct(raw, categories, registry) {
  const slug = slugify(raw.slug)
  const files = `files/${slug}`
  return {
    slug,
    name: raw.name,
    categories: resolveCategorySlugs(raw.category, categories),
    description: raw.description,
    notesHtml: raw.helper?.trim() || null,
    specs: normalizeSpecs(raw.specs),
    pricing: normalizePricing(raw.pricing),
    videos: raw.videos?.uids ?? [],
    thumbnail: toImage(raw.thumbnail, `images/${slug}`, registry, raw.name),
    images: raw.images.map((image) => toImage(image, `images/${slug}`, registry, raw.name)),
    documents: {
      template: toFile(raw.template, files, registry),
      catalogPage: toFile(raw.catalogPage, files, registry),
      fullCatalog: toFile(raw.fullCatalog, "files/catalogs", registry),
    },
  }
}

function toCategory(raw, registry) {
  const slug = slugify(raw.slug)
  return {
    slug,
    name: raw.name,
    description: raw.description,
    photo: toImage(raw.photo, `images/categories`, registry, raw.name),
  }
}

function toCompany(raw, registry) {
  return {
    name: raw.company,
    blurb: raw.blurb,
    about: raw.about,
    address: raw.address,
    email: raw.email,
    phone: raw.phone,
    mapUrl: raw.map,
    logo: toImage(raw.logo, "images/company", registry, raw.company),
    logoLine: toImage(raw.logoLine, "images/company", registry, raw.company),
    terms: toFile(raw.terms, "files/company", registry),
  }
}

function toFeatured(raw, registry) {
  return {
    name: raw.name,
    description: raw.description,
    path: raw.slug.toLowerCase().replace(/\s+/g, "-"),
    image: toImage(raw.image, "images/featured", registry, raw.name),
  }
}

// Old Gatsby product URL -> new URL, kept only where the path actually changed,
// so Netlify can 301 old links and search results.
function buildLegacyRedirects(rawProducts, products) {
  return rawProducts
    .map((raw, index) => ({
      from: encodeURI(`/${legacyCategorySegment(raw.category)}/${raw.slug}`),
      to: `/${products[index].categories[0]}/${products[index].slug}`,
    }))
    .filter((redirect) => redirect.from !== redirect.to)
}

export function transformContent(data) {
  assertCountsFit(data)
  const registry = createAssetRegistry()
  const categories = data.allCategories.map((raw) => toCategory(raw, registry))
  const products = data.allProducts.map((raw) => toProduct(raw, categories, registry))

  const duplicateSlugs = products
    .map((product) => product.slug)
    .filter((slug, index, all) => all.indexOf(slug) !== index)
  if (duplicateSlugs.length) throw new Error(`Duplicate product slugs: ${duplicateSlugs.join(", ")}`)

  return {
    company: toCompany(data.company, registry),
    categories,
    featured: data.allBannerproducts.map((raw) => toFeatured(raw, registry)),
    products,
    redirects: buildLegacyRedirects(data.allProducts, products),
    assets: registry.list(),
  }
}

// ---------- edges: filesystem ----------

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(value, null, 2) + "\n")
}

async function writeContent(content) {
  await writeJson(path.join(CONTENT_DIR, "company.json"), content.company)
  await writeJson(path.join(CONTENT_DIR, "categories.json"), content.categories)
  await writeJson(path.join(CONTENT_DIR, "featured.json"), content.featured)
  for (const product of content.products) {
    await writeJson(path.join(CONTENT_DIR, "products", `${product.slug}.json`), product)
  }
  await writeJson(path.join(EXPORT_DIR, "legacy-redirects.json"), content.redirects)
  await writeJson(path.join(EXPORT_DIR, "asset-manifest.json"), content.assets)
}

async function main() {
  const token = process.env.DATO_API_TOKEN
  if (!token) throw new Error("DATO_API_TOKEN is not set; run with --env-file=.env")

  const content = transformContent(await fetchDatoContent(token))
  await writeContent(content)
  console.log(`Wrote ${content.products.length} products, ${content.categories.length} categories, ${content.featured.length} featured items`)

  const outcomes = await runWithConcurrency(content.assets, DOWNLOAD_CONCURRENCY, downloadAsset)
  const downloaded = outcomes.filter((outcome) => outcome === "downloaded").length
  const totalBytes = content.assets.reduce((sum, asset) => sum + asset.size, 0)
  console.log(`Assets: ${content.assets.length} referenced (${(totalBytes / 1e6).toFixed(1)} MB), ${downloaded} downloaded, ${content.assets.length - downloaded} already present`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
