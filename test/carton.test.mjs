import { test } from "node:test"
import assert from "node:assert/strict"
import { itemForSize, renderCartonSvg } from "../static/js/carton.js"

const sizes = [
  { item: "U5520", w: 1, l: 1, d: 2 },
  { item: "U5523", w: 2, l: 2, d: 6 },
  { item: "U5524", w: 3, l: 2, d: 12 },
]

test("a listed size is priced as its own item", () => {
  assert.equal(itemForSize(sizes, { w: 2, l: 2, d: 6 }), "U5523")
})

test("an in-between size is priced as the cheapest listed size that fits", () => {
  assert.equal(itemForSize(sizes, { w: 1.5, l: 1.25, d: 4 }), "U5523")
})

test("a size beyond the table has no item", () => {
  assert.equal(itemForSize(sizes, { w: 4, l: 2, d: 2 }), null)
})

test("the drawing describes its style, state and size for screen readers", () => {
  const svg = renderCartonSvg({ w: 2, l: 3, d: 5 }, "reverse", "closed")
  assert.match(svg, /aria-label="Isometric model of a reverse tuck end carton assembled, 2 in\. wide, 3 in\. long and 5 in\. deep, drawn to scale\."/)
})
