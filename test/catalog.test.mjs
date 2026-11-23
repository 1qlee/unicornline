import { test } from "node:test"
import assert from "node:assert/strict"
import { buildCatalog } from "../src/catalog.mjs"
import { numberWord, formatQuantityLabel } from "../src/format.mjs"

function product(slug, name, categories) {
  return { file: `${slug}.json`, data: { slug, name, categories } }
}

const catalog = buildCatalog({
  company: {},
  featured: [],
  categories: [
    { slug: "gift-box", name: "Gift Box" },
    { slug: "eating-well", name: "Eating Well" },
  ],
  products: [
    product("pillow-boxes", "Pillow Boxes", ["gift-box"]),
    product("favor-boxes", "Favor Boxes", ["gift-box"]),
    product("salt-pepper", "Salt & Pepper Set", ["gift-box", "eating-well"]),
    product("teas", "Teas", ["eating-well"]),
  ],
})

test("categories and their products are listed alphabetically", () => {
  assert.deepEqual(catalog.categories.map((category) => category.name), ["Eating Well", "Gift Box"])
  assert.deepEqual(
    catalog.categoryBySlug("gift-box").products.map((item) => item.name),
    ["Favor Boxes", "Pillow Boxes", "Salt & Pepper Set"],
  )
})

test("a product in two categories appears in both but is counted once", () => {
  assert.equal(catalog.categoryBySlug("eating-well").products.length, 2)
  assert.equal(catalog.products.length, 4)
})

test("previous and next wrap around within the primary category", () => {
  const favor = catalog.productBySlug("favor-boxes")
  assert.equal(catalog.neighbours(favor).previous.name, "Salt & Pepper Set")
  assert.equal(catalog.neighbours(favor).next.name, "Pillow Boxes")
})

test("counts read as words up to twenty and quantities get thousands separators", () => {
  assert.equal(numberWord(8), "eight")
  assert.equal(numberWord(86), "86")
  assert.equal(formatQuantityLabel("10000"), "10,000")
  assert.equal(formatQuantityLabel("Item"), "Item")
})
