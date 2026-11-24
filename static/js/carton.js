// Isometric model of a tuck end folding carton, drawn as SVG from real dimensions
// in inches. Pure functions, shared by the build (server render) and the browser.
//
// Axes: x runs along L, y along W, z up along D. The viewer looks from +x, +y, +z,
// so the visible walls are the front (y = W, showing L) and the right side
// (x = L, showing W), matching the catalog's carton diagrams.
//
// A carton is described by its size, tuck style and four fold amounts from 0
// (closed) to 1 (fully open): topLid, topDust, bottomLid, bottomDust. Every
// in-between value is a real hinge angle, so the drawing can be animated.

const COS30 = Math.cos(Math.PI / 6)
const SIN30 = 0.5
const DEG = Math.PI / 180
const TOP_LID_OPEN = 102 * DEG
const BOTTOM_LID_OPEN = 106 * DEG
const DUST_FLAP_OPEN = 104 * DEG
// A closing tuck is bent a little past square so it slides down inside the far wall.
const TUCK_INTO_CAVITY = -(90 + 4) * DEG
// Fold range, after the tuck tip clears the rim, over which the tuck straightens out.
const TUCK_CLEARANCE_MARGIN = 0.04
const TUCK_STRAIGHTEN_SPAN = 0.25
// Flaps flatter than this are painted with the closed-carton order.
const FLAT_ANGLE = 45 * DEG
const PADDING = 0.6
const DIMENSION_OFFSET = 0.45
const VIEWER = [1, 1, 1]

// The design system's illustration tones: paper and illus-grey for the board,
// illus-ink for the shadowed cavity, blue for the printed panel.
const COLORS = {
  ink: "#0b0b0b",
  outside: "#ffffff",
  outsideShade: "#dde0e6",
  inside: "#dde0e6",
  insideDeep: "#12151a",
  flapInside: "#dde0e6",
  print: "#0033ff",
}

export const STYLES = {
  straight: { label: "Straight tuck end", short: "STE" },
  reverse: { label: "Reverse tuck end", short: "RTE" },
}

export const VIEWS = {
  open: "Flaps open",
  closed: "Assembled",
}

export function cartonState(size, style, view) {
  const fold = view === "closed" ? 0 : 1
  return { ...size, style, topLid: fold, topDust: fold, bottomLid: fold, bottomDust: fold }
}

// ---------- vector helpers ----------

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const clamp01 = (value) => Math.min(1, Math.max(0, value))

function project([x, y, z]) {
  return [(x - y) * COS30, (x + y) * SIN30 - z]
}

// ---------- flap geometry ----------

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

// A flat panel attached along a hinge. `along` runs down the hinge, `out` points
// away from it; `outsideSign` flips the normal so it points to the carton's outside.
function panel(origin, along, out, outline, outsideSign) {
  const points = outline.map(([u, v]) => add(origin, add(scale(along, u), scale(out, v))))
  const outsideNormal = scale(cross(along, out), outsideSign)
  return { points, showsOutside: dot(outsideNormal, VIEWER) > 0 }
}

const smoothstep = (t) => t * t * (3 - 2 * t)

// Lid (with its tuck flap) hinged along x. sgnY is the direction the closed lid
// lies in (+1 toward the front); sgnZ is the side it opens to (+1 up, -1 down).
//
// Angles are measured in the lid's plane of rotation: 0 lies flat across the
// opening, positive swings away from the box. Below the fold where the tuck tip
// could reach the rim, the tuck points into the cavity, so it never passes
// through a wall; above it, the tuck straightens out in line with the lid.
function lidAssembly({ w, l }, hinge, sgnY, sgnZ, fold, openAngle, tuckLength) {
  const angle = openAngle * fold
  const clearFold = Math.asin(Math.min(1, tuckLength / w)) / openAngle + TUCK_CLEARANCE_MARGIN
  const straightened = smoothstep(clamp01((fold - clearFold) / TUCK_STRAIGHTEN_SPAN))
  const tuckDirection = TUCK_INTO_CAVITY + (angle - TUCK_INTO_CAVITY) * straightened
  const direction = (theta) => [0, sgnY * Math.cos(theta), sgnZ * Math.sin(theta)]
  const along = [1, 0, 0]
  const outsideSign = sgnY * sgnZ
  const lidOut = direction(angle)
  const lid = panel(hinge, along, lidOut, [[0, 0], [l, 0], [l, w], [0, w]], outsideSign)
  const tuckOrigin = add(hinge, scale(lidOut, w))
  const tuck = panel(tuckOrigin, along, direction(tuckDirection), tuckFlapOutline(l, tuckLength), outsideSign)
  // Any part of the tuck past the rim plane is inside the box.
  const rimZ = hinge[2]
  const inCavity = tuck.points.some(([, , z]) => sgnZ * (z - rimZ) < -1e-6)
  return { lid, tuck, angle, inCavity }
}

// Dust flap hinged along y on the x = xHinge edge. outward is -1 or +1 (which side
// of the carton), rise is +1 for the top end and -1 for the bottom end.
function dustFlap({ w }, xHinge, z, outward, rise, fold, height) {
  const angle = DUST_FLAP_OPEN * fold
  const out = [-outward * Math.cos(angle), 0, rise * Math.sin(angle)]
  const flap = panel([xHinge, 0, z], [0, 1, 0], out, dustFlapOutline(w, height), outward * rise)
  return { ...flap, angle }
}

// ---------- painting ----------

function face(points3d, fill) {
  return { points: points3d.map(project), fill }
}

function flapFace(flap, insideFill = COLORS.flapInside) {
  return face(flap.points, flap.showsOutside ? COLORS.outside : insideFill)
}

function printPanel({ w, l, d }) {
  const marginX = l * 0.18
  const bottom = d * 0.3
  const top = d * 0.62
  return [[marginX, w, bottom], [l - marginX, w, bottom], [l - marginX, w, top], [marginX, w, top]]
}

// Painter's order, back to front. The box is convex, so its two visible walls hide
// everything behind them except what shows through the open top. Flaps switch
// between "folded against the box" and "swung out" ordering at FLAT_ANGLE.
// The carton's moving panels in 3D (inches), for drawing and for geometry checks.
export function cartonGeometry(state) {
  const { w, l, d, style } = state
  const { tuck, dust } = flapSizes(state)
  const reverse = style === "reverse"
  return {
    topLid: lidAssembly(state, [0, 0, d], 1, 1, state.topLid, TOP_LID_OPEN, tuck),
    bottomLid: reverse
      ? lidAssembly(state, [0, w, 0], -1, -1, state.bottomLid, BOTTOM_LID_OPEN, tuck)
      : lidAssembly(state, [0, 0, 0], 1, -1, state.bottomLid, BOTTOM_LID_OPEN, tuck),
    topLeft: dustFlap(state, 0, d, -1, 1, state.topDust, dust),
    topRight: dustFlap(state, l, d, 1, 1, state.topDust, dust),
    bottomLeft: dustFlap(state, 0, 0, -1, -1, state.bottomDust, dust),
    bottomRight: dustFlap(state, l, 0, 1, -1, state.bottomDust, dust),
  }
}

export function cartonPolygons(state) {
  const { w, l, d, style } = state
  const reverse = style === "reverse"
  const { topLid, bottomLid, topLeft, topRight, bottomLeft, bottomRight } = cartonGeometry(state)

  const before = []
  const after = []
  const bottomLidInFront = reverse && bottomLid.angle >= FLAT_ANGLE
  ;(bottomLidInFront ? after : before).push(flapFace(bottomLid.lid))
  if (!bottomLid.inCavity) (bottomLidInFront ? after : before).push(flapFace(bottomLid.tuck))
  before.push(flapFace(bottomLeft))
  ;(bottomRight.angle >= FLAT_ANGLE ? after : before).push(flapFace(bottomRight))

  const interior = [
    face([[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0]], COLORS.insideDeep),
    face([[0, 0, 0], [l, 0, 0], [l, 0, d], [0, 0, d]], COLORS.inside),
    face([[0, 0, 0], [0, w, 0], [0, w, d], [0, 0, d]], COLORS.insideDeep),
  ]
  // Tucks inside the box sit in front of the inner walls and behind the outer ones.
  const cavity = [topLid, bottomLid].filter((lid) => lid.inCavity).map((lid) => flapFace(lid.tuck))
  const walls = [
    face([[0, w, 0], [l, w, 0], [l, w, d], [0, w, d]], COLORS.outside),
    face([[l, 0, 0], [l, w, 0], [l, w, d], [l, 0, d]], COLORS.outsideShade),
    face(printPanel(state), COLORS.print),
  ]

  const lidFaces = [flapFace(topLid.lid), ...(topLid.inCavity ? [] : [flapFace(topLid.tuck)])]
  const dustFaces = [flapFace(topLeft), flapFace(topRight)]
  const topFaces = topLid.angle >= FLAT_ANGLE ? [...lidFaces, ...dustFaces] : [...dustFaces, ...lidFaces]

  return [
    ...before,
    ...interior,
    ...cavity,
    ...walls,
    ...after,
    ...topFaces,
  ]
}

function formatInches(value) {
  return `${Number(value.toFixed(2))} in.`
}

// The lowest point of the bottom flaps, or the base when they are shut.
function floorZ(state) {
  const { bottomLid, bottomLeft, bottomRight } = cartonGeometry(state)
  const points = [bottomLid.lid, bottomLid.tuck, bottomLeft, bottomRight].flatMap((flap) => flap.points)
  return Math.min(0, ...points.map(([, , z]) => z))
}

// Every size the visitor can change gets a dimension line. D runs up the front
// corner; L and W run along the base, dropped below any open bottom flap so the
// flaps never cover them, with extension lines back up to the base corners.
function dimensionLines(state) {
  const { w, l, d } = state
  const offset = DIMENSION_OFFSET
  const floor = floorZ(state)
  const dropped = floor < -0.01
  const extend = (...corners) => (dropped ? corners.map((corner) => [corner, [corner[0], corner[1], floor]]) : [])
  return [
    { from: [0, w + offset, 0], to: [0, w + offset, d], label: `D ${formatInches(d)}`, anchor: "end", nudge: [-8, 0], extensions: [] },
    {
      from: [0, w + offset, floor],
      to: [l, w + offset, floor],
      label: `L ${formatInches(l)}`,
      anchor: "end",
      nudge: [-6, 18],
      extensions: extend([0, w + offset, 0], [l, w + offset, 0]),
    },
    {
      from: [l + offset, 0, floor],
      to: [l + offset, w, floor],
      label: `W ${formatInches(w)}`,
      anchor: "start",
      nudge: [6, 18],
      extensions: extend([l + offset, 0, 0], [l + offset, w, 0]),
    },
  ]
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

export function describeCarton(state) {
  const open = state.topLid > 0.5 || state.bottomLid > 0.5
  const condition = open ? "with its top and bottom flaps open" : "assembled"
  return `Isometric model of a ${STYLES[state.style].label.toLowerCase()} carton ${condition}, ${formatInches(state.w)} wide, ${formatInches(state.l)} long and ${formatInches(state.d)} deep, drawn to scale.`
}

function layout(state) {
  const shapes = cartonPolygons(state)
  const dimensions = dimensionLines(state).map((line) => ({
    ...line,
    from2: project(line.from),
    to2: project(line.to),
    extensions2: line.extensions.map(([start, end]) => [project(start), project(end)]),
  }))
  return { shapes, dimensions }
}

// [x, y, width, height] that fits the drawing with padding, in inches.
export function cartonViewBox(state) {
  const { shapes, dimensions } = layout(state)
  const box = bounds([...shapes.flatMap((shape) => shape.points), ...dimensions.flatMap((line) => [line.from2, line.to2])])
  const pad = PADDING + Math.max(state.w, state.l, state.d) * 0.08
  return [box.minX - pad * 2, box.minY - pad, box.maxX - box.minX + pad * 3, box.maxY - box.minY + pad * 2]
}

export function renderCartonSvg(state, frame = cartonViewBox(state)) {
  const { shapes, dimensions } = layout(state)
  const viewBox = frame.map(round)

  const polygons = shapes.map((shape) => `<polygon points="${pointsAttr(shape.points)}" fill="${shape.fill}"/>`).join("")

  // The viewBox is in inches, so text and markers are sized relative to it.
  const fontSize = Math.max(viewBox[2], viewBox[3]) * 0.03
  const pxToUnits = fontSize / 14
  const dims = dimensions
    .map(({ from2, to2, extensions2, label, anchor, nudge }) => {
      const mid = [(from2[0] + to2[0]) / 2, (from2[1] + to2[1]) / 2]
      const x = round(mid[0] + nudge[0] * pxToUnits)
      const y = round(mid[1] + nudge[1] * pxToUnits)
      const r = round(2.5 * pxToUnits)
      const extensions = extensions2
        .map(([start, end]) => `<line class="carton-ext" x1="${round(start[0])}" y1="${round(start[1])}" x2="${round(end[0])}" y2="${round(end[1])}"/>`)
        .join("")
      return `<g class="carton-dim">${extensions}<line x1="${round(from2[0])}" y1="${round(from2[1])}" x2="${round(to2[0])}" y2="${round(to2[1])}"/><circle cx="${round(from2[0])}" cy="${round(from2[1])}" r="${r}"/><circle cx="${round(to2[0])}" cy="${round(to2[1])}" r="${r}"/><text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${round(fontSize)}">${escapeText(label)}</text></g>`
    })
    .join("")

  return `<svg class="carton-svg" viewBox="${viewBox.join(" ")}" role="img" aria-label="${escapeText(describeCarton(state))}" preserveAspectRatio="xMidYMid meet"><g class="carton-faces" stroke="${COLORS.ink}" stroke-opacity=".85" stroke-width="1" stroke-linejoin="round">${polygons}</g>${dims}</svg>`
}

// Only a size listed in the table has an item; any other size has none.
export function itemForSize(sizes, { w, l, d }) {
  return sizes.find((size) => size.w === w && size.l === l && size.d === d)?.item ?? null
}

export function sizeMessage(item) {
  return item ? `Priced as ${item} in the table below.` : ""
}

const distance = (a, b) => Math.hypot(a.w - b.w, a.l - b.l, a.d - b.d)

// The listed size to step to from the drawn one. From a listed size, the step
// goes to the nearest size of the adjacent item code, next (direction 1) or previous (-1).
// From an unlisted size, it rounds up to the nearest listed size that holds it,
// or down to the nearest one it holds. Null when there is nowhere to go.
function sizesOfAdjacentItem(sizes, item, direction) {
  const items = [...new Set(sizes.map((size) => size.item))].sort()
  const adjacent = items[items.indexOf(item) + direction]
  return sizes.filter((size) => size.item === adjacent)
}

export function steppedSize(sizes, size, direction) {
  const item = itemForSize(sizes, size)
  const candidates = item
    ? sizesOfAdjacentItem(sizes, item, direction)
    : sizes.filter((other) =>
        ["w", "l", "d"].every((key) => (direction > 0 ? other[key] >= size[key] : other[key] <= size[key])),
      )
  if (candidates.length === 0) return null
  return candidates.reduce((best, other) => {
    const gap = distance(other, size) - distance(best, size)
    if (gap !== 0) return gap < 0 ? other : best
    return direction * other.item.localeCompare(best.item) < 0 ? other : best
  })
}

const formatSize = ({ w, l, d }, unit) => `${w} x ${l} x ${d} ${unit}`

// Shown in place of prices when the drawn size is not a row of the size table.
export function customSizeMessage(size, unit) {
  return `This size isn't in our price table, but we make cartons to any size. Send us the ${formatSize(size, unit)} size and the quantity you need, and we'll price it for you.`
}

// What the quote form receives as the product, so the request names the size.
export function customSizeProduct(productName, { style, ...size }, unit) {
  return `${productName}, ${STYLES[style].label.toLowerCase()}, ${formatSize(size, unit)}`
}

export function sizeLimits(sizes) {
  return {
    w: Math.max(...sizes.map((size) => size.w)),
    l: Math.max(...sizes.map((size) => size.l)),
    d: Math.max(...sizes.map((size) => size.d)),
  }
}
