// Reads the W x L x D size table from a folding-carton catalog page (PDF) and
// either prints it or writes it into a product's model.
//
//   node scripts/parse-carton-sizes.mjs <slug>
//       prints the sizes from the product's catalog page
//   node scripts/parse-carton-sizes.mjs <slug> --type <kind> [--default 2x2x5]
//       writes { type, unit, defaultSize, sizes } into content/products/<slug>.json
//
// The PDF comes from the asset host (site.config.json assetBaseUrl), or from a
// local file passed with --pdf <path>.

import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"
import { KINDS } from "../static/js/carton.js"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")
const UNIT = "in."
const DEFAULT_SIZE = "2x2x5"
const ITEM_HEADER = "ITEM NO"
const ITEM_PATTERN = /^U\d+$/
const NUMBER_PATTERN = /^\d+(\.\d+)?$/

const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance
const multiply = (m, n) => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
]
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]

function parseArgs(argv) {
  const [slug, ...rest] = argv
  const options = {}
  for (let index = 0; index < rest.length; index += 2) options[rest[index].replace(/^--/, "")] = rest[index + 1]
  if (!slug) throw new Error("usage: parse-carton-sizes.mjs <slug> [--type <kind>] [--default WxLxD] [--pdf <path>]")
  return { slug, ...options }
}

async function loadPdf(product, localPath) {
  if (localPath) return readFile(localPath)
  const key = product.documents.catalogPage?.key
  if (!key) throw new Error(`${product.slug} has no catalog page`)
  const { assetBaseUrl } = JSON.parse(await readFile(path.join(ROOT, "site.config.json"), "utf8"))
  const url = `${assetBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} fetching ${url}`)
  return Buffer.from(await response.arrayBuffer())
}

// Horizontal rules in page coordinates. Merged item cells are bounded by these.
async function horizontalRules(page) {
  const { fnArray, argsArray } = await page.getOperatorList()
  const OPS = pdfjs.OPS
  const stack = []
  const rules = []
  let ctm = [1, 0, 0, 1, 0, 0]
  fnArray.forEach((fn, index) => {
    const args = argsArray[index]
    if (fn === OPS.save) stack.push(ctm)
    else if (fn === OPS.restore) ctm = stack.pop()
    else if (fn === OPS.transform) ctm = multiply(ctm, args)
    else if (fn === OPS.paintFormXObjectBegin && args[0]) ctm = multiply(ctm, args[0])
    else if (fn === OPS.constructPath) {
      const [x0, y0] = apply(ctm, args[2][0], args[2][1])
      const [x1, y1] = apply(ctm, args[2][2], args[2][3])
      if (near(y0, y1, 0.5)) rules.push({ y: y0, x0: Math.min(x0, x1), x1: Math.max(x0, x1) })
    }
  })
  return rules
}

async function pageTokens(page) {
  const { items } = await page.getTextContent()
  return items.filter((item) => item.str.trim()).map((item) => ({ x: item.transform[4], y: item.transform[5], text: item.str.trim() }))
}

// One "ITEM NO | W | L | D" column block: its rows of numbers, the item labels in
// its merged cells, and the rules that split those cells.
function readBlock(header, tokens, rules) {
  const headerCell = (text) => tokens.find((t) => t.text === text && near(t.y, header.y, 5) && t.x > header.x && t.x < header.x + 90)
  const [W, L, D] = ["W", "L", "D"].map(headerCell)
  if (!W || !L || !D) return null
  const below = tokens.filter((t) => t.y < header.y - 3)
  // Numbers are right-aligned under their header letter.
  const column = (letter) => below.filter((t) => NUMBER_PATTERN.test(t.text) && near(t.x + t.text.length * 2, letter.x + 2, 6))
  const lengths = column(L)
  const depths = column(D)
  const rows = column(W)
    .map((width) => {
      const length = lengths.find((t) => near(t.y, width.y, 2))
      const depth = depths.find((t) => near(t.y, width.y, 2))
      return length && depth ? { y: width.y, w: Number(width.text), l: Number(length.text), d: Number(depth.text) } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.y - a.y)
  if (rows.length === 0) return null
  const lowest = rows[rows.length - 1].y - 8
  const labels = below.filter((t) => ITEM_PATTERN.test(t.text) && t.y >= lowest && t.x >= header.x - 6 && t.x < W.x - 10)
  const probe = (header.x + W.x) / 2
  const cuts = rules.filter((rule) => rule.x0 <= probe && rule.x1 >= probe && rule.y < header.y && rule.y > lowest).map((rule) => rule.y)
  const cellIndex = (y) => cuts.filter((cut) => cut > y + 3).length
  return { rows, labels, cellIndex }
}

async function parseSizes(data) {
  const document = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise
  const sizes = []
  for (let number = 1; number <= document.numPages; number++) {
    const page = await document.getPage(number)
    const tokens = await pageTokens(page)
    const rules = await horizontalRules(page)
    const headers = tokens.filter((t) => t.text === ITEM_HEADER).sort((a, b) => a.x - b.x || b.y - a.y)
    // A merged cell can run past the foot of one column and continue, unlabeled, at
    // the head of the next, so an unlabeled first cell takes the previous item.
    let carried = null
    for (const header of headers) {
      const block = readBlock(header, tokens, rules)
      if (!block) continue
      for (const row of block.rows) {
        const cell = block.cellIndex(row.y)
        const item = block.labels.find((label) => block.cellIndex(label.y) === cell)?.text ?? (cell === 0 ? carried : null)
        if (!item) throw new Error(`page ${number}: no item number for the ${row.w} x ${row.l} x ${row.d} row`)
        sizes.push({ item, w: row.w, l: row.l, d: row.d })
      }
      carried = sizes[sizes.length - 1].item
    }
  }
  if (sizes.length === 0) throw new Error(`no "${ITEM_HEADER} W L D" size table found`)
  return sizes
}

// Standard 2-space JSON with one size per line, as the existing product files use.
function serializeProduct(product) {
  const marker = "__SIZES__"
  const text = JSON.stringify({ ...product, model: { ...product.model, sizes: marker } }, null, 2)
  const lines = product.model.sizes.map((s) => `      {"item": "${s.item}", "w": ${s.w}, "l": ${s.l}, "d": ${s.d}}`).join(",\n")
  return `${text.replace(`"${marker}"`, `[\n${lines}\n    ]`)}\n`
}

function parseSize(text) {
  const [w, l, d] = text.split("x").map(Number)
  if (![w, l, d].every((value) => value > 0)) throw new Error(`--default must look like 2x2x5, got "${text}"`)
  return { w, l, d }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const file = path.join(ROOT, "content", "products", `${args.slug}.json`)
  const product = JSON.parse(await readFile(file, "utf8"))
  const sizes = await parseSizes(await loadPdf(product, args.pdf))
  if (!args.type) return console.log(JSON.stringify(sizes, null, 2))

  if (!KINDS[args.type]) throw new Error(`unknown kind "${args.type}"; known: ${Object.keys(KINDS).join(", ")}`)
  const defaultSize = parseSize(args.default ?? DEFAULT_SIZE)
  const listed = sizes.some((s) => s.w === defaultSize.w && s.l === defaultSize.l && s.d === defaultSize.d)
  if (!listed) throw new Error(`the default size ${args.default ?? DEFAULT_SIZE} is not in the size table`)
  await writeFile(file, serializeProduct({ ...product, model: { type: args.type, unit: UNIT, defaultSize, sizes } }))
  console.log(`${args.slug}: wrote a ${args.type} model with ${sizes.length} sizes`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
