import { test } from "node:test"
import assert from "node:assert/strict"
import { validateContent } from "../src/validate.mjs"
import { productPath, categoryPath, assetUrl } from "../src/urls.mjs"

function image(overrides = {}) {
  return { key: "images/x/a.png", alt: "A candle", width: 10, height: 10, ...overrides }
}

function product(overrides = {}) {
  return {
    slug: "candles",
    name: "Candles",
    categories: ["lifestyle"],
    specs: { features: [], materials: [], printing: [], options: [], customShape: null },
    pricing: { note: "Digital, 6C.", columns: [{ label: "Item", method: null }, { label: "96", method: "digital" }], rows: [["U1", "1.00"]] },
    videos: [],
    thumbnail: image(),
    images: [image()],
    documents: { template: null, catalogPage: { key: "files/c.pdf" }, fullCatalog: { key: "files/f.pdf" } },
    ...overrides,
  }
}

function content(productOverrides = {}, file = "candles.json") {
  return {
    company: { name: "Unicorn Line", owner: "Unicorn Graphics", lede: "Lede", address: "1 Main St", phone: "516-222-0712", phoneE164: "+15162220712" },
    categories: [{ slug: "lifestyle", name: "Lifestyle" }],
    featured: [],
    products: [{ file, data: product(productOverrides) }],
  }
}

test("valid content produces no errors", () => {
  assert.deepEqual(validateContent(content()), [])
})

test("reports a product that names a category that doesn't exist", () => {
  const errors = validateContent(content({ categories: ["gift-box"] }))
  assert.deepEqual(errors, ['candles.json: unknown category "gift-box"'])
})

test("reports a pricing row with the wrong number of cells", () => {
  const pricing = { note: "Digital, 6C.", columns: [{ label: "Item", method: null }], rows: [["U1", "1.00"]] }
  assert.deepEqual(validateContent(content({ pricing })), ["candles.json pricing: row 1 has 2 cells, expected 1"])
})

test("reports a featured item pointing at a product that doesn't exist", () => {
  const data = content()
  data.featured = [{ title: "T", line: "L", cta: "C", drawing: "d.svg", target: { product: "mugs" } }]
  assert.deepEqual(validateContent(data), ['featured.json[0]: unknown product "mugs"'])
})

test("reports images without alt text", () => {
  const errors = validateContent(content({ images: [image({ alt: "" })] }))
  assert.deepEqual(errors, ["candles.json images[0]: missing alt text"])
})

test("reports a file name that doesn't match the slug", () => {
  assert.deepEqual(validateContent(content({}, "Candles.json")), [
    'Candles.json: file name must match slug "candles"',
  ])
})

test("a product in several categories lives under its first one", () => {
  assert.equal(productPath({ slug: "salt-pepper", categories: ["gift-box", "eating-well"] }), "/gift-box/salt-pepper/")
  assert.equal(categoryPath("gift-box"), "/gift-box/")
})

test("asset URLs join the base and key without doubled slashes", () => {
  assert.equal(assetUrl("https://files.example.com/", "files/a b.pdf"), "https://files.example.com/files/a%20b.pdf")
})
