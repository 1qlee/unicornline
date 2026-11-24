import { test } from "node:test"
import assert from "node:assert/strict"
import * as carton from "../static/js/carton.js"
import { itemForSize, renderCartonSvg, cartonState } from "../static/js/carton.js"

const sizes = [
  { item: "U5520", w: 1, l: 1, d: 2 },
  { item: "U5523", w: 2, l: 2, d: 6 },
  { item: "U5524", w: 3, l: 2, d: 12 },
]

test("a listed size is priced as its own item", () => {
  assert.equal(itemForSize(sizes, { w: 2, l: 2, d: 6 }), "U5523")
})

test("an unlisted size has no item, even when a listed size would fit it", () => {
  assert.equal(itemForSize(sizes, { w: 1.5, l: 1.25, d: 4 }), null)
})

test("a size beyond the table has no item", () => {
  assert.equal(itemForSize(sizes, { w: 4, l: 2, d: 2 }), null)
})

test("the drawing describes its style, state and size for screen readers", () => {
  const svg = renderCartonSvg(cartonState({ w: 2, l: 3, d: 5 }, "reverse", "closed"))
  assert.match(svg, /aria-label="Isometric model of a reverse tuck end carton assembled, 2 in\. wide, 3 in\. long and 5 in\. deep, drawn to scale\."/)
})

test("no flap passes through a wall at any point while folding", () => {
  const { cartonGeometry } = carton
  const sizes = [{ w: 1, l: 1, d: 1 }, { w: 2, l: 2, d: 5 }, { w: 7, l: 4, d: 3 }, { w: 1, l: 4, d: 14 }, { w: 3.5, l: 1.25, d: 2 }]
  const tolerance = 1e-9
  for (const size of sizes) {
    for (const style of ["straight", "reverse"]) {
      for (let step = 0; step <= 100; step++) {
        const fold = step / 100
        const geometry = cartonGeometry({ ...size, style, topLid: fold, topDust: fold, bottomLid: fold, bottomDust: fold })
        const panels = [
          geometry.topLid.lid, geometry.topLid.tuck, geometry.bottomLid.lid, geometry.bottomLid.tuck,
          geometry.topLeft, geometry.topRight, geometry.bottomLeft, geometry.bottomRight,
        ]
        for (const { points } of panels) {
          for (const [x, y, z] of points) {
            const betweenFloorAndRim = z > tolerance && z < size.d - tolerance
            if (!betweenFloorAndRim) continue
            const insideCavity = x >= -tolerance && x <= size.l + tolerance && y >= -tolerance && y <= size.w + tolerance
            assert.ok(insideCavity, `${style} ${JSON.stringify(size)} fold ${fold}: point ${[x, y, z].map((v) => v.toFixed(3))} is outside the walls`)
          }
        }
      }
    }
  }
})

test("stepping from a listed size moves to the nearest size of the adjacent item", async () => {
  const { steppedSize } = await import("../static/js/carton.js")
  const withMiddle = [...sizes, { item: "U5521", w: 1, l: 1, d: 4 }, { item: "U5521", w: 3, l: 3, d: 9 }]
  assert.equal(steppedSize(withMiddle, { w: 2, l: 2, d: 6 }, 1).item, "U5524")
  assert.deepEqual(steppedSize(withMiddle, { w: 2, l: 2, d: 6 }, -1), { item: "U5521", w: 1, l: 1, d: 4 })
  assert.equal(steppedSize(sizes, { w: 3, l: 2, d: 12 }, 1), null)
})

test("stepping from an unlisted size rounds up or down to a listed size", async () => {
  const { steppedSize } = await import("../static/js/carton.js")
  assert.deepEqual(steppedSize(sizes, { w: 1.5, l: 1.5, d: 4 }, 1), { item: "U5523", w: 2, l: 2, d: 6 })
  assert.deepEqual(steppedSize(sizes, { w: 1.5, l: 1.5, d: 4 }, -1), { item: "U5520", w: 1, l: 1, d: 2 })
})
