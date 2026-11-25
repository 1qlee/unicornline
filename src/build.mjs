// Builds the static site into dist/: validates content, renders every page and
// copies static files and the vendored PDF.js.

import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { loadContent } from "./content.mjs"
import { validateContent } from "./validate.mjs"
import { buildCatalog } from "./catalog.mjs"
import { renderHome, renderCategoryRedirect } from "./render/home.mjs"
import { renderProduct } from "./render/product.mjs"
import { renderViewer } from "./render/viewer.mjs"
import { renderNotFound } from "./render/not-found.mjs"
import { productPath, categoryPath } from "./urls.mjs"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const DIST = path.join(ROOT, "dist")
const PDFJS_FILES = ["pdf.min.mjs", "pdf.worker.min.mjs"]

async function writePage(urlPath, html) {
  const file = path.join(DIST, urlPath, urlPath.endsWith("/") ? "index.html" : "")
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, html)
}

async function copyStatic() {
  await cp(path.join(ROOT, "static"), DIST, { recursive: true })
  const pdfjsSource = path.join(ROOT, "node_modules", "pdfjs-dist", "build")
  await mkdir(path.join(DIST, "vendor", "pdfjs"), { recursive: true })
  for (const file of PDFJS_FILES) {
    await cp(path.join(pdfjsSource, file), path.join(DIST, "vendor", "pdfjs", file))
  }
}

async function main() {
  const config = JSON.parse(await readFile(path.join(ROOT, "site.config.json"), "utf8"))
  const content = await loadContent(path.join(ROOT, "content"))

  const errors = validateContent(content)
  if (errors.length) {
    throw new Error(`Content has ${errors.length} problem(s):\n  ${errors.join("\n  ")}`)
  }

  const catalog = buildCatalog(content)
  await rm(DIST, { recursive: true, force: true })
  await copyStatic()

  await writePage("/", renderHome(catalog, config))
  await writePage("/viewer/", renderViewer(catalog, config))
  await writeFile(path.join(DIST, "404.html"), renderNotFound(catalog, config))
  for (const category of catalog.categories) {
    await writePage(categoryPath(category.slug), renderCategoryRedirect(category, config))
  }
  for (const product of catalog.products) {
    await writePage(productPath(product), renderProduct(product, catalog, config))
  }

  console.log(`Built ${catalog.products.length} product pages, ${catalog.categories.length} category redirects, home, viewer and 404 into dist/`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
