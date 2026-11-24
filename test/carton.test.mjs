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
  const svg = renderCartonSvg(cartonState({ w: 2, l: 3, d: 5 }, "tuck-end-carton", "reverse", "closed"))
  assert.match(svg, /aria-label="Isometric model of a reverse tuck end carton assembled, 2 in\. wide, 3 in\. long and 5 in\. deep, drawn to scale\."/)
})

test("no flap of any carton kind passes through a wall at any point while folding", () => {
  const { cartonGeometry, KINDS } = carton
  const sizes = [{ w: 1, l: 1, d: 1 }, { w: 2, l: 2, d: 5 }, { w: 7, l: 4, d: 3 }, { w: 1, l: 4, d: 14 }, { w: 3.5, l: 1.25, d: 2 }]
  const tolerance = 1e-9
  for (const [kind, { styles }] of Object.entries(KINDS)) {
    for (const style of Object.keys(styles ?? { none: "" })) {
      for (const size of sizes) {
        for (let step = 0; step <= 100; step++) {
          const fold = step / 100
          const { top, bottom } = cartonGeometry({ ...size, kind, style, topLid: fold, topDust: fold, bottomLid: fold, bottomDust: fold })
          for (const { points } of [...top, ...bottom]) {
            for (const [x, y, z] of points) {
              const betweenFloorAndRim = z > tolerance && z < size.d - tolerance
              if (!betweenFloorAndRim) continue
              const insideCavity = x >= -tolerance && x <= size.l + tolerance && y >= -tolerance && y <= size.w + tolerance
              assert.ok(insideCavity, `${kind} ${style} ${JSON.stringify(size)} fold ${fold}: point ${[x, y, z].map((v) => v.toFixed(3))} is outside the walls`)
            }
          }
        }
      }
    }
  }
})

test("each kind has flaps exactly at the ends it closes", () => {
  const { cartonGeometry, cartonState, KINDS } = carton
  for (const [kind, { top, bottom }] of Object.entries(KINDS)) {
    const geometry = cartonGeometry(cartonState({ w: 2, l: 2, d: 5 }, kind, null, "open"))
    assert.equal(geometry.top.length > 0, Boolean(top), `${kind} top`)
    assert.equal(geometry.bottom.length > 0, Boolean(bottom), `${kind} bottom`)
  }
})

test("mailer box sizes step in size order, not text order", async () => {
  const { steppedSize } = await import("../static/js/carton.js")
  const mailers = [
    { item: "10 x 10 x 4 in.", w: 10, l: 10, d: 4 },
    { item: "8 x 8 x 2.75 in.", w: 8, l: 8, d: 2.75 },
    { item: "11 x 11 x 4 in.", w: 11, l: 11, d: 4 },
  ]
  assert.equal(steppedSize(mailers, { w: 8, l: 8, d: 2.75 }, 1).item, "10 x 10 x 4 in.")
  assert.equal(steppedSize(mailers, { w: 10, l: 10, d: 4 }, 1).item, "11 x 11 x 4 in.")
  assert.equal(steppedSize(mailers, { w: 8, l: 8, d: 2.75 }, -1), null)
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

// ---------- flaps never pass through each other ----------

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const crossProduct = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dotProduct = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const CROSSING = 1e-6
const OVERLAP = 1e-4

const planeOf = ([origin, p1, p2]) => ({ origin, normal: crossProduct(sub(p1, origin), sub(p2, origin)) })

// Where a convex flap passes through a plane: the two points its edges cross it at,
// or null when the flap only touches the plane or stays on one side.
function crossingThroughPlane(points, { origin, normal }) {
  const sides = points.map((point) => dotProduct(normal, sub(point, origin)) / Math.hypot(...normal))
  if (!sides.some((value) => value > CROSSING) || !sides.some((value) => value < -CROSSING)) return null
  const hits = []
  points.forEach((start, index) => {
    const next = (index + 1) % points.length
    const [s0, s1] = [sides[index], sides[next]]
    if (Math.abs(s0) <= CROSSING) hits.push(start)
    else if ((s0 > CROSSING && s1 < -CROSSING) || (s0 < -CROSSING && s1 > CROSSING)) {
      const t = s0 / (s0 - s1)
      hits.push(start.map((value, axis) => value + (points[next][axis] - value) * t))
    }
  })
  return hits.length >= 2 ? hits : null
}

// True when the point lies inside the convex flap, clear of its edges.
function strictlyInside(point, points) {
  const { normal } = planeOf(points)
  const size = Math.hypot(...normal)
  return points.every((corner, index) => {
    const next = points[(index + 1) % points.length]
    const edge = sub(next, corner)
    return dotProduct(crossProduct(edge, sub(point, corner)), normal) / (size * Math.hypot(...edge)) > OVERLAP
  })
}

// Two flaps pass through each other when each crosses the other's plane and the
// two crossing segments share a stretch inside both flaps. Sharing a hinge,
// touching at a corner or lying flat on each other does not count.
function flapsCross(a, b) {
  const alongA = crossingThroughPlane(a.points, planeOf(b.points))
  const alongB = crossingThroughPlane(b.points, planeOf(a.points))
  if (!alongA || !alongB) return false
  const direction = crossProduct(planeOf(a.points).normal, planeOf(b.points).normal)
  const position = (point) => dotProduct(point, direction)
  const span = (hits) => [Math.min(...hits.map(position)), Math.max(...hits.map(position))]
  const [aLow, aHigh] = span(alongA)
  const [bLow, bHigh] = span(alongB)
  const low = Math.max(aLow, bLow)
  const high = Math.min(aHigh, bHigh)
  if (high - low <= OVERLAP * Math.hypot(...direction)) return false
  const [first, last] = [alongA.reduce((m, p) => (position(p) < position(m) ? p : m)), alongA.reduce((m, p) => (position(p) > position(m) ? p : m))]
  const t = ((low + high) / 2 - position(first)) / (position(last) - position(first))
  const middle = first.map((value, axis) => value + (last[axis] - value) * t)
  return strictlyInside(middle, a.points) && strictlyInside(middle, b.points)
}

test("no two flaps pass through each other while the model opens or closes", () => {
  const { cartonGeometry, cartonState, foldStateAt, KINDS } = carton
  const sizes = [{ w: 1, l: 1, d: 1 }, { w: 2, l: 2, d: 5 }, { w: 7, l: 4, d: 3 }, { w: 1, l: 4, d: 14 }, { w: 3.5, l: 1.25, d: 2 }, { w: 6, l: 1, d: 3 }]
  for (const [kind, { styles }] of Object.entries(KINDS)) {
    for (const style of Object.keys(styles ?? { none: "" })) {
      for (const size of sizes) {
        const open = cartonState(size, kind, style, "open")
        const closed = cartonState(size, kind, style, "closed")
        for (const [from, to, direction] of [[open, closed, "closing"], [closed, open, "opening"]]) {
          for (let step = 0; step <= 200; step++) {
            const { top, bottom } = cartonGeometry(foldStateAt(from, to, step / 200))
            for (const end of [top, bottom]) {
              end.forEach((a, i) => end.slice(i + 1).forEach((b) => {
                assert.ok(!flapsCross(a, b), `${kind} ${style} ${JSON.stringify(size)} ${direction} at ${step / 200}: ${a.edge} ${a.role} crosses ${b.edge} ${b.role}`)
              }))
            }
          }
        }
      }
    }
  }
})
