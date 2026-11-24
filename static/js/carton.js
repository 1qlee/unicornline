// Isometric model of a tuck end folding carton, drawn as SVG from real dimensions
// in inches. Pure functions, shared by the build (server render) and the browser.
//
// Axes: x runs along L, y along W, z up along D. The viewer looks from +x, +y, +z,
// so the visible walls are the front (y = W, showing L) and the right side
// (x = L, showing W), matching the catalog's carton diagrams.

const COS30 = Math.cos(Math.PI / 6)
const SIN30 = 0.5
const LID_TILT = (12 * Math.PI) / 180
const DUST_FLAP_TILT = (14 * Math.PI) / 180
const BOTTOM_LID_TILT = (16 * Math.PI) / 180
const PADDING = 0.6
const DIMENSION_OFFSET = 0.45

const COLORS = {
  ink: "#0B0B0B",
  outside: "#FFFFFF",
  outsideShade: "#E4E7EE",
  top: "#F4F5F8",
  inside: "#C9CDD6",
  insideDeep: "#A9AEBA",
  flapInside: "#E9ECF2",
  print: "#0033FF",
}

export const STYLES = {
  straight: { label: "Straight tuck end", short: "STE" },
  reverse: { label: "Reverse tuck end", short: "RTE" },
}

export const VIEWS = {
  open: "Flaps open",
  closed: "Assembled",
}

function project([x, y, z]) {
  return [(x - y) * COS30, (x + y) * SIN30 - z]
}

function polygon(points3d, fill, extra = "") {
  return { points: points3d.map(project), fill, extra }
}

// Flap outlines in local (along-hinge, away-from-hinge) coordinates.
function tuckFlapOutline(width, length) {
  const shoulder = Math.min(length * 0.45, width * 0.25)
  return [
    [0, 0],
    [width, 0],
    [width, length * 0.55],
    [width - shoulder, length],
    [shoulder, length],
    [0, length * 0.55],
  ]
}

function dustFlapOutline(width, height) {
  return [
    [0, 0],
    [width, 0],
    [width - height * 0.12, height * 0.55],
    [Math.max(width - height * 0.9, width * 0.45), height],
    [Math.min(height * 0.2, width * 0.2), height],
    [0, height * 0.7],
  ]
}

export function flapSizes({ w }) {
  return {
    tuck: Math.min(Math.max(w * 0.35, 0.4), 1),
    dust: Math.min(Math.max(w * 0.4, 0.35), 1.6),
  }
}

function boxWalls({ w, l, d }) {
  return {
    front: [[0, w, 0], [l, w, 0], [l, w, d], [0, w, d]],
    right: [[l, 0, 0], [l, w, 0], [l, w, d], [l, 0, d]],
    top: [[0, 0, d], [l, 0, d], [l, w, d], [0, w, d]],
    floor: [[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0]],
    innerBack: [[0, 0, 0], [l, 0, 0], [l, 0, d], [0, 0, d]],
    innerLeft: [[0, 0, 0], [0, w, 0], [0, w, d], [0, 0, d]],
  }
}

function printPanel({ w, l, d }) {
  const marginX = l * 0.18
  const bottom = d * 0.3
  const top = d * 0.62
  return [[marginX, w, bottom], [l - marginX, w, bottom], [l - marginX, w, top], [marginX, w, top]]
}

// Lid panel plus tuck flap, hinged on an edge running along x at (y0, z0).
// `lean` is +1 to fall toward the viewer (front hinge), -1 to lean away (back hinge);
// `rise` is +1 for a lid standing up from the top, -1 for one hanging from the bottom.
function lidPanels({ w, l }, { y0, z0, lean, rise }, tilt, tuckLength) {
  const place = ([u, v]) => [u, y0 + lean * Math.sin(tilt) * v, z0 + rise * Math.cos(tilt) * v]
  const lid = [[0, 0], [l, 0], [l, w], [0, w]].map(place)
  const tuck = tuckFlapOutline(l, tuckLength).map(([u, v]) => place([u, v + w]))
  return { lid, tuck }
}

// Dust flap hinged on the x = xHinge edge at height z0, splayed outward.
function dustFlap({ w }, { xHinge, outward, z0, rise }, height) {
  return dustFlapOutline(w, height).map(([u, v]) => [
    xHinge + outward * Math.sin(DUST_FLAP_TILT) * v,
    u,
    z0 + rise * Math.cos(DUST_FLAP_TILT) * v,
  ])
}

// Paint order is back to front; the box is convex, so its front walls hide
// everything behind them except what shows through the open top.
export function cartonPolygons(size, style, view) {
  const { w, l, d } = size
  const walls = boxWalls(size)
  const { tuck, dust } = flapSizes(size)
  const shapes = []

  if (view === "closed") {
    shapes.push(polygon(walls.top, COLORS.top))
    shapes.push(polygon(walls.front, COLORS.outside))
    shapes.push(polygon(walls.right, COLORS.outsideShade))
    shapes.push(polygon(printPanel(size), COLORS.print))
    return shapes
  }

  const topLid = lidPanels(size, { y0: 0, z0: d, lean: -1, rise: 1 }, LID_TILT, tuck)
  const bottomHingeFront = style === "reverse"
  const bottomLid = lidPanels(
    size,
    bottomHingeFront ? { y0: w, z0: 0, lean: 1, rise: -1 } : { y0: 0, z0: 0, lean: -1, rise: -1 },
    BOTTOM_LID_TILT,
    tuck,
  )

  if (!bottomHingeFront) {
    shapes.push(polygon(bottomLid.lid, COLORS.flapInside), polygon(bottomLid.tuck, COLORS.flapInside))
  }
  shapes.push(polygon(dustFlap(size, { xHinge: 0, outward: -1, z0: 0, rise: -1 }, dust), COLORS.flapInside))
  shapes.push(polygon(topLid.lid, COLORS.flapInside), polygon(topLid.tuck, COLORS.flapInside))
  shapes.push(polygon(dustFlap(size, { xHinge: 0, outward: -1, z0: d, rise: 1 }, dust), COLORS.flapInside))
  shapes.push(polygon(walls.floor, COLORS.insideDeep))
  shapes.push(polygon(walls.innerBack, COLORS.inside))
  shapes.push(polygon(walls.innerLeft, COLORS.insideDeep))
  shapes.push(polygon(walls.front, COLORS.outside))
  shapes.push(polygon(walls.right, COLORS.outsideShade))
  shapes.push(polygon(printPanel(size), COLORS.print))
  shapes.push(polygon(dustFlap(size, { xHinge: l, outward: 1, z0: d, rise: 1 }, dust), COLORS.outside))
  shapes.push(polygon(dustFlap(size, { xHinge: l, outward: 1, z0: 0, rise: -1 }, dust), COLORS.outside))
  if (bottomHingeFront) {
    shapes.push(polygon(bottomLid.lid, COLORS.outside), polygon(bottomLid.tuck, COLORS.outside))
  }
  return shapes
}

function formatInches(value) {
  return `${Number(value.toFixed(2))} in.`
}

// Dimension lines drawn just outside the edges they measure.
function dimensionLines({ w, l, d }, view) {
  const lines = []
  const offset = DIMENSION_OFFSET
  lines.push({ from: [0, w + offset, 0], to: [0, w + offset, d], label: `D ${formatInches(d)}`, anchor: "end", nudge: [-8, 0] })
  if (view === "closed") {
    lines.push({ from: [0, w + offset, 0], to: [l, w + offset, 0], label: `L ${formatInches(l)}`, anchor: "end", nudge: [-6, 18] })
    lines.push({ from: [l + offset, 0, 0], to: [l + offset, w, 0], label: `W ${formatInches(w)}`, anchor: "start", nudge: [6, 18] })
  }
  return lines
}

function bounds(points) {
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
}

const round = (value) => Math.round(value * 1000) / 1000
const pointsAttr = (points) => points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ")

function escapeText(text) {
  return String(text).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character])
}

export function describeCarton(size, style, view) {
  const state = view === "closed" ? "assembled" : "with its top and bottom flaps open"
  return `Isometric model of a ${STYLES[style].label.toLowerCase()} carton ${state}, ${formatInches(size.w)} wide, ${formatInches(size.l)} long and ${formatInches(size.d)} deep, drawn to scale.`
}

export function renderCartonSvg(size, style, view) {
  const shapes = cartonPolygons(size, style, view)
  const dimensions = dimensionLines(size, view).map((line) => ({ ...line, from2: project(line.from), to2: project(line.to) }))
  const box = bounds([...shapes.flatMap((shape) => shape.points), ...dimensions.flatMap((line) => [line.from2, line.to2])])
  const pad = PADDING + Math.max(size.w, size.l, size.d) * 0.08
  const viewBox = [box.minX - pad * 2, box.minY - pad, box.maxX - box.minX + pad * 3, box.maxY - box.minY + pad * 2].map(round)

  const polygons = shapes
    .map((shape) => `<polygon points="${pointsAttr(shape.points)}" fill="${shape.fill}"/>`)
    .join("")
  // The viewBox is in inches, so text and markers are sized relative to it.
  const fontSize = Math.max(viewBox[2], viewBox[3]) * 0.03
  const pxToUnits = fontSize / 14
  const dims = dimensions
    .map(({ from2, to2, label, anchor, nudge }) => {
      const mid = [(from2[0] + to2[0]) / 2, (from2[1] + to2[1]) / 2]
      const x = round(mid[0] + nudge[0] * pxToUnits)
      const y = round(mid[1] + nudge[1] * pxToUnits)
      const r = round(2.5 * pxToUnits)
      return `<g class="carton-dim"><line x1="${round(from2[0])}" y1="${round(from2[1])}" x2="${round(to2[0])}" y2="${round(to2[1])}"/><circle cx="${round(from2[0])}" cy="${round(from2[1])}" r="${r}"/><circle cx="${round(to2[0])}" cy="${round(to2[1])}" r="${r}"/><text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${round(fontSize)}">${escapeText(label)}</text></g>`
    })
    .join("")

  return `<svg class="carton-svg" viewBox="${viewBox.join(" ")}" role="img" aria-label="${escapeText(describeCarton(size, style, view))}" preserveAspectRatio="xMidYMid meet"><g class="carton-faces" stroke="${COLORS.ink}" stroke-opacity=".85" stroke-width="1" stroke-linejoin="round">${polygons}</g>${dims}</svg>`
}

// Sizes between table rows are priced as the cheapest listed size that fits.
export function itemForSize(sizes, { w, l, d }) {
  const fitting = sizes.filter((size) => size.w >= w && size.l >= l && size.d >= d)
  if (fitting.length === 0) return null
  return fitting.reduce((best, size) => (size.item < best.item ? size : best)).item
}

export function sizeMessage(item) {
  return item
    ? `Priced as ${item} in the table below.`
    : "Larger than the size table. Contact us for a custom quote."
}

export function sizeLimits(sizes) {
  return {
    w: Math.max(...sizes.map((size) => size.w)),
    l: Math.max(...sizes.map((size) => size.l)),
    d: Math.max(...sizes.map((size) => size.d)),
  }
}
