// Isometric models of folding cartons, drawn as SVG from real dimensions in
// inches. Pure functions, shared by the build (server render) and the browser.
//
// Axes: x runs along L, y along W, z up along D. The viewer looks from +x, +y, +z,
// so the visible walls are the front (y = W, showing L) and the right side
// (x = L, showing W), matching the catalog's carton diagrams.
//
// A carton is described by its kind, size, style (tuck end only) and four fold
// amounts from 0 (closed) to 1 (fully open): topLid, topDust, bottomLid and
// bottomDust. "Lid" folds move the flaps hinged on the long edges (a tuck lid,
// seal-end major flaps, snap-lock major flaps); "Dust" folds move the flaps on
// the short edges. Every in-between value is a real hinge angle, so the drawing
// can be animated.

import { SOLIDS } from "./solids.js"

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

// What each size means for a kind: the field label, the letter on its dimension
// line and the word for the screen-reader description. `order` is how the kind
// writes a size ("W x L x D"); `fixed` sizes are set by the material, not the visitor.
const CARTON_DIMENSIONS = {
  order: ["w", "l", "d"],
  w: { label: "Width", short: "W", word: "wide" },
  l: { label: "Length", short: "L", word: "long" },
  d: { label: "Depth", short: "D", word: "deep" },
}

// Each kind names how its top and bottom close, or the solid it is. A kind with
// styles lets the visitor choose one; a kind without flaps has no open or
// assembled view.
export const KINDS = {
  "tuck-end-carton": {
    label: "tuck end carton",
    top: "tuck",
    bottom: "tuck",
    styles: { straight: "Straight tuck end", reverse: "Reverse tuck end" },
  },
  "seal-end-carton": { label: "seal end carton", top: "seal", bottom: "seal" },
  "snap-lock-carton": { label: "tuck top snap lock bottom carton", top: "tuck", bottom: "snap" },
  "sleeve-carton": { label: "carton sleeve", top: null, bottom: null },
  // Roll end tuck front: a rigid tray and a lid hinged at the back, with a tuck
  // at the front and side ears that fold down inside the side walls.
  "mailer-box": {
    label: "mailer box",
    top: "mailer",
    bottom: null,
    dustFlaps: false,
    dimensions: { ...CARTON_DIMENSIONS, order: ["l", "w", "d"] },
  },
  "favor-box": {
    label: "favor box",
    solid: "favor",
    dimensions: {
      order: ["w", "d", "l"],
      w: { label: "Width", short: "W", word: "wide" },
      d: { label: "Height", short: "H", word: "high" },
      l: { label: "Length", short: "L", word: "long" },
    },
  },
  "pillow-box": {
    label: "pillow box",
    solid: "pillow",
    dimensions: { ...CARTON_DIMENSIONS, order: ["l", "w", "d"] },
  },
  // A board or framed print hanging on a wall. A size turned on its side is the
  // same product, so 10 x 8 prices as 8 x 10.
  "wall-panel": {
    label: "wall panel",
    solid: "panel",
    turns: true,
    dimensions: {
      order: ["l", "d"],
      fixed: ["w"],
      l: { label: "Width", short: "W", word: "wide" },
      d: { label: "Height", short: "H", word: "high" },
      w: { label: "Thickness", short: "T", word: "thick" },
    },
  },
}

export const dimensionsOf = (kind) => KINDS[kind].dimensions ?? CARTON_DIMENSIONS
export const isSolid = (kind) => Boolean(KINDS[kind].solid)

export const VIEWS = {
  open: "Flaps open",
  closed: "Assembled",
}

export const hasFlaps = (kind) => Boolean(KINDS[kind].top || KINDS[kind].bottom)
export const defaultStyle = (kind) => Object.keys(KINDS[kind].styles ?? {})[0] ?? null

export const FOLDS = ["topLid", "topDust", "bottomLid", "bottomDust"]
const SIZE_KEYS = ["w", "l", "d"]

// Real cartons open lid first, then the dust flaps; they close in reverse.
// Each fold moves within its own window of an animation's 0..1 timeline.
const OPENING_WINDOWS = { Lid: [0, 0.6], Dust: [0.4, 1] }
const CLOSING_WINDOWS = { Dust: [0, 0.5], Lid: [0.4, 1] }

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// A kind with no dust flaps gives its lid the whole timeline instead of waiting
// for dust flaps that are not there.
function foldWindow(key, from, to, kind) {
  if (SIZE_KEYS.includes(key)) return [0, 1]
  if (KINDS[kind]?.dustFlaps === false) return [0, 1]
  const part = key.endsWith("Lid") ? "Lid" : "Dust"
  return (to > from ? OPENING_WINDOWS : CLOSING_WINDOWS)[part]
}

// The carton part way through an animation from one state to another.
export function foldStateAt(from, to, progress) {
  const state = { ...to }
  for (const key of [...SIZE_KEYS, ...FOLDS]) {
    const [start, end] = foldWindow(key, from[key], to[key], to.kind)
    const local = easeInOut(clamp01((progress - start) / (end - start)))
    state[key] = from[key] + (to[key] - from[key]) * local
  }
  return state
}

export function cartonState(size, kind, style, view) {
  const fold = view === "closed" ? 0 : 1
  return { ...size, kind, style: style ?? defaultStyle(kind), topLid: fold, topDust: fold, bottomLid: fold, bottomDust: fold }
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

// ---------- flap outlines (u along the hinge, v away from it) ----------

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

// Dust flaps stop short of the front and back walls, like the relief cuts on a real
// die line, so a tuck can slide down past them against the wall.
const DUST_RELIEF = 0.12
const RELIEF_MARGIN = 0.03

// How far from the wall a closing tuck dips below the rim: its hinge has not quite
// reached the wall when its tip first passes the rim, and it leans in past square.
function tuckRelief(w, tuck) {
  const hingeGap = w - Math.sqrt(Math.max(0, w * w - tuck * tuck))
  const lean = tuck * Math.sin(-TUCK_INTO_CAVITY - Math.PI / 2)
  return Math.max(DUST_RELIEF, hingeGap + lean + RELIEF_MARGIN)
}

function dustFlapOutline(width, height, relief = DUST_RELIEF) {
  const inner = width - relief * 2
  return [
    [0, 0],
    [inner, 0],
    [inner - height * 0.12, height * 0.55],
    [Math.max(inner - height * 0.9, inner * 0.45), height],
    [Math.min(height * 0.2, inner * 0.2), height],
    [0, height * 0.7],
  ].map(([u, v]) => [u + relief, v])
}

const rectangleOutline = (width, length) => [[0, 0], [width, 0], [width, length], [0, length]]

// Snap-lock bottom flaps taper so the four of them interlock under the carton.
function snapMajorOutline(width, depth) {
  const inset = Math.min(depth * 0.6, width * 0.2)
  return [[0, 0], [width, 0], [width - inset, depth], [inset, depth]]
}

function snapSideOutline(width, depth) {
  return [[0, 0], [width, 0], [width * 0.7, depth], [width * 0.15, depth]]
}

// Flaps folding in from opposite edges never reach each other, so each is kept
// under half the span it folds across.
const FACING_FLAP_REACH = 0.45

export function flapSizes({ w, l }) {
  return {
    tuck: Math.min(Math.max(w * 0.35, 0.4), 1),
    dust: Math.min(Math.max(w * 0.4, 0.35), 1.6, l * FACING_FLAP_REACH),
    snapMajor: w * 0.55,
    snapSide: Math.min(w * 0.45, l * FACING_FLAP_REACH),
  }
}

// Two flaps that close onto each other take turns: the back flap closes in the
// first half of the fold, the front flap in the second, so the front one only
// comes down once the back one lies flat. Opening runs the same path in reverse.
const backFold = (fold) => clamp01(fold * 2 - 1)
const frontFold = (fold) => clamp01(fold * 2)

// A flat panel attached along a hinge. `along` runs down the hinge, `out` points
// away from it; `outsideSign` flips the normal so it points to the carton's outside.
function panel(origin, along, out, outline, outsideSign) {
  const points = outline.map(([u, v]) => add(origin, add(scale(along, u), scale(out, v))))
  const outsideNormal = scale(cross(along, out), outsideSign)
  return { points, showsOutside: dot(outsideNormal, VIEWER) > 0 }
}

const smoothstep = (t) => t * t * (3 - 2 * t)

// Which wall edge a flap hangs from. Front and right are the visible walls.
const NEAR_EDGES = new Set(["front", "right"])

// A flap hinged along x (a long edge). sgnY is the direction the closed flap lies
// in (+1 from the back edge toward the front); sgnZ is the side it opens to
// (+1 up, -1 down). Angle 0 lies flat across the opening.
function longEdgeDirection(sgnY, sgnZ) {
  return (theta) => [0, sgnY * Math.cos(theta), sgnZ * Math.sin(theta)]
}

// Lid (with its tuck flap) hinged along x. Below the fold where the tuck tip could
// reach the rim, the tuck points into the cavity, so it never passes through a
// wall; above it, the tuck straightens out in line with the lid.
function lidAssembly({ w, l }, hinge, sgnY, sgnZ, fold, openAngle, tuckLength) {
  const angle = openAngle * fold
  const clearFold = Math.asin(Math.min(1, tuckLength / w)) / openAngle + TUCK_CLEARANCE_MARGIN
  const straightened = smoothstep(clamp01((fold - clearFold) / TUCK_STRAIGHTEN_SPAN))
  const tuckDirection = TUCK_INTO_CAVITY + (angle - TUCK_INTO_CAVITY) * straightened
  const direction = longEdgeDirection(sgnY, sgnZ)
  const along = [1, 0, 0]
  const outsideSign = sgnY * sgnZ
  const lidOut = direction(angle)
  const edge = sgnY > 0 ? "back" : "front"
  const lid = panel(hinge, along, lidOut, rectangleOutline(l, w), outsideSign)
  const tuckOrigin = add(hinge, scale(lidOut, w))
  const tuck = panel(tuckOrigin, along, direction(tuckDirection), tuckFlapOutline(l, tuckLength), outsideSign)
  // Any part of the tuck past the rim plane is inside the box.
  const rimZ = hinge[2]
  const inCavity = tuck.points.some(([, , z]) => sgnZ * (z - rimZ) < -1e-6)
  return [
    { ...lid, angle, edge, role: "lid" },
    { ...tuck, angle, edge, role: "tuck", inCavity },
  ]
}

// A plain flap hinged along x: seal-end and snap-lock major flaps.
function longEdgeFlap({ l }, hinge, sgnY, sgnZ, fold, openAngle, outline) {
  const angle = openAngle * fold
  const flap = panel(hinge, [1, 0, 0], longEdgeDirection(sgnY, sgnZ)(angle), outline, sgnY * sgnZ)
  return { ...flap, angle, edge: sgnY > 0 ? "back" : "front", role: "major" }
}

// A flap hinged along y on the x = xHinge edge. outward is -1 or +1 (which side
// of the carton), rise is +1 for the top end and -1 for the bottom end.
function shortEdgeFlap(xHinge, z, outward, rise, fold, outline) {
  const angle = DUST_FLAP_OPEN * fold
  const out = [-outward * Math.cos(angle), 0, rise * Math.sin(angle)]
  const flap = panel([xHinge, 0, z], [0, 1, 0], out, outline, outward * rise)
  return { ...flap, angle, edge: outward > 0 ? "right" : "left", role: "dust" }
}

// ---------- ends ----------

function dustFlaps(state, z, rise, fold, outline) {
  return [shortEdgeFlap(0, z, -1, rise, fold, outline), shortEdgeFlap(state.l, z, 1, rise, fold, outline)]
}

function tuckEnd(state, isTop) {
  const { w, d } = state
  const sizes = flapSizes(state)
  const reverseBottom = !isTop && state.style === "reverse"
  const lid = isTop
    ? lidAssembly(state, [0, 0, d], 1, 1, state.topLid, TOP_LID_OPEN, sizes.tuck)
    : reverseBottom
      ? lidAssembly(state, [0, w, 0], -1, -1, state.bottomLid, BOTTOM_LID_OPEN, sizes.tuck)
      : lidAssembly(state, [0, 0, 0], 1, -1, state.bottomLid, BOTTOM_LID_OPEN, sizes.tuck)
  const outline = dustFlapOutline(w, sizes.dust, tuckRelief(w, sizes.tuck))
  const dust = isTop ? dustFlaps(state, d, 1, state.topDust, outline) : dustFlaps(state, 0, -1, state.bottomDust, outline)
  return [...lid, ...dust]
}

// Full-overlap seal end: two major flaps, each as deep as the carton is wide, with
// the front one glued over the back one, and two dust flaps under them.
function sealEnd(state, isTop) {
  const { w, l, d } = state
  const z = isTop ? d : 0
  const rise = isTop ? 1 : -1
  const fold = isTop ? state.topLid : state.bottomLid
  const openAngle = isTop ? TOP_LID_OPEN : BOTTOM_LID_OPEN
  const outline = rectangleOutline(l, w)
  return [
    longEdgeFlap(state, [0, 0, z], 1, rise, backFold(fold), openAngle, outline),
    longEdgeFlap(state, [0, w, z], -1, rise, frontFold(fold), openAngle, outline),
    ...dustFlaps(state, z, rise, isTop ? state.topDust : state.bottomDust, dustFlapOutline(w, flapSizes(state).dust)),
  ]
}

// Snap-lock (1-2-3) bottom: four tapered flaps that fold under and lock together.
function snapEnd(state) {
  const { w, l } = state
  const sizes = flapSizes(state)
  const majors = snapMajorOutline(l, sizes.snapMajor)
  return [
    longEdgeFlap(state, [0, 0, 0], 1, -1, backFold(state.bottomLid), BOTTOM_LID_OPEN, majors),
    longEdgeFlap(state, [0, w, 0], -1, -1, frontFold(state.bottomLid), BOTTOM_LID_OPEN, majors),
    ...dustFlaps(state, 0, -1, state.bottomDust, snapSideOutline(w, sizes.snapSide)),
  ]
}

// Mailer box lid. The tuck is almost as deep as the box. The ears stand square to
// the lid and turn with it; their front corner is cut back to a quarter circle
// about the hinge, so as the lid closes they sweep down inside the side walls
// without passing the front wall, and stop short of the front tuck.
const EAR_INSET = 0.08
const MAILER_TUCK_DEPTH = 0.85
const MAILER_EAR_DEPTH = 0.9

// Every point of an ear stays within `reach` of the hinge, so the ear can never
// swing past the front wall; on a box deeper than it is wide, the ear is shortened.
function mailerEarOutline(depth, reach) {
  const earDepth = Math.min(depth, reach * 0.95)
  const lowCorner = Math.sqrt(reach * reach - earDepth * earDepth)
  return [[0, 0], [reach, 0], [lowCorner, earDepth], [0, earDepth]]
}

function mailerEnd(state) {
  const { w, l, d } = state
  const tuckLength = Math.min(d * MAILER_TUCK_DEPTH, w * 0.6)
  const [lid, tuck] = lidAssembly(state, [0, 0, d], 1, 1, state.topLid, TOP_LID_OPEN, tuckLength)
  const theta = lid.angle
  const alongLid = [0, Math.cos(theta), Math.sin(theta)]
  const intoBox = [0, Math.sin(theta), -Math.cos(theta)]
  const outline = mailerEarOutline(d * MAILER_EAR_DEPTH, w - tuckRelief(w, tuckLength))
  // Under a lid that is mostly shut, the ears are inside the box: painted with the
  // cavity, behind the walls and under the lid.
  const tucked = theta < FLAT_ANGLE
  const ear = (x, outsideSign, edge) => ({
    ...panel([x, 0, d], alongLid, intoBox, outline, outsideSign),
    angle: theta,
    edge,
    role: "ear",
    inCavity: tucked,
  })
  return [lid, tuck, ear(EAR_INSET, 1, "left"), ear(l - EAR_INSET, -1, "right")]
}

const END_BUILDERS = { tuck: tuckEnd, seal: sealEnd, snap: (state) => snapEnd(state), mailer: mailerEnd }

// The carton's moving panels in 3D (inches), for drawing and for geometry checks.
export function cartonGeometry(state) {
  const kind = KINDS[state.kind]
  return {
    top: kind.top ? END_BUILDERS[kind.top](state, true) : [],
    bottom: kind.bottom ? END_BUILDERS[kind.bottom](state, false) : [],
  }
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

// Every kind, sleeve included, shows the same shadowed cavity, so they read as
// hollow in the same way.
function cavityInterior({ w, l, d }) {
  return [
    face([[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0]], COLORS.insideDeep),
    face([[0, 0, 0], [l, 0, 0], [l, 0, d], [0, 0, d]], COLORS.inside),
    face([[0, 0, 0], [0, w, 0], [0, w, d], [0, 0, d]], COLORS.insideDeep),
  ]
}

// Top flaps all sit above the walls. Swung open, far flaps (back, left) are painted
// before near ones; folded flat, they stack in closing order: dust flaps first,
// then the back flap, then whatever closes over it.
function topOrder(flaps) {
  const lids = flaps.filter((flap) => flap.role !== "dust")
  const dust = flaps.filter((flap) => flap.role === "dust")
  const lidsOpen = lids.some((flap) => flap.angle >= FLAT_ANGLE)
  if (!lidsOpen) return [...dust, ...lids]
  const far = lids.filter((flap) => !NEAR_EDGES.has(flap.edge))
  const near = lids.filter((flap) => NEAR_EDGES.has(flap.edge))
  return [...far, ...dust, ...near]
}

// Painter's order, back to front. The box is convex, so its two visible walls hide
// everything behind them except what shows through the open top. A bottom flap on
// a near edge swings in front of the walls once it is more open than FLAT_ANGLE.
export function cartonPolygons(state) {
  if (isSolid(state.kind)) return solidShapes(state)
  const { w, l, d } = state
  const { top, bottom } = cartonGeometry(state)
  const inCavity = (flap) => flap.inCavity === true
  const inFront = (flap) => NEAR_EDGES.has(flap.edge) && flap.angle >= FLAT_ANGLE

  const bottomOutside = bottom.filter((flap) => !inCavity(flap))
  const before = bottomOutside.filter((flap) => !inFront(flap)).map((flap) => flapFace(flap))
  const after = bottomOutside.filter(inFront).map((flap) => flapFace(flap))

  const interior = cavityInterior(state)
  // Tucks inside the box sit in front of the inner walls and behind the outer ones.
  const cavity = [...top, ...bottom].filter(inCavity).map((flap) => flapFace(flap))
  const walls = [
    face([[0, w, 0], [l, w, 0], [l, w, d], [0, w, d]], COLORS.outside),
    face([[l, 0, 0], [l, w, 0], [l, w, d], [l, 0, d]], COLORS.outsideShade),
    face(printPanel(state), COLORS.print),
  ]
  const topFaces = topOrder(top.filter((flap) => !inCavity(flap))).map((flap) => flapFace(flap))

  return [...before, ...interior, ...cavity, ...walls, ...after, ...topFaces]
}

// ---------- solids ----------

const newellNormal = (points) =>
  points.reduce(
    (sum, point, index) => {
      const next = points[(index + 1) % points.length]
      return [
        sum[0] + (point[1] - next[1]) * (point[2] + next[2]),
        sum[1] + (point[2] - next[2]) * (point[0] + next[0]),
        sum[2] + (point[0] - next[0]) * (point[1] + next[1]),
      ]
    },
    [0, 0, 0],
  )
const centroid = (points) => scale(points.reduce(add, [0, 0, 0]), 1 / points.length)
const PRINT_INSET = 0.08
const SEAM = (a, b) => [a, b].map((point) => point.map((value) => value.toFixed(4)).join(",")).sort().join("|")

// Board faces shade by where they point: up and front are paper, right is grey.
function solidFill([nx, ny, nz]) {
  const length = Math.hypot(nx, ny, nz)
  if (nz / length > 0.5) return COLORS.outside
  return nx > ny ? COLORS.outsideShade : COLORS.outside
}

// The print area on a printed face, inset from its edges.
function printDecal(points) {
  const middle = centroid(points)
  return points.map((point) => add(middle, scale(add(point, scale(middle, -1)), 1 - PRINT_INSET * 2)))
}

// Faces turned toward the viewer, painted far to near, then the outline: edges
// where a visible face meets nothing visible, or meets a different surface.
// Seams inside one smooth surface stay hidden, so curves read as curves.
function solidShapes(state) {
  const faces = SOLIDS[KINDS[state.kind].solid](state)
  const middle = centroid(faces.flatMap((face) => face.points))
  const visible = faces
    .map((face) => {
      const raw = newellNormal(face.points)
      const outward = dot(raw, add(centroid(face.points), scale(middle, -1))) >= 0 ? raw : scale(raw, -1)
      return { ...face, normal: outward }
    })
    .filter((face) => dot(face.normal, VIEWER) > 1e-9)
    .sort((a, b) => dot(centroid(a.points), VIEWER) - dot(centroid(b.points), VIEWER))

  const shapes = visible.flatMap((face) => {
    const fill = solidFill(face.normal)
    const base = { points: face.points.map(project), fill, stroke: fill }
    return face.printed ? [base, { points: printDecal(face.points).map(project), fill: COLORS.print }] : [base]
  })

  const seams = new Map()
  for (const face of visible) {
    face.points.forEach((point, index) => {
      const next = face.points[(index + 1) % face.points.length]
      const key = SEAM(point, next)
      const seam = seams.get(key) ?? { ends: [point, next], surfaces: [] }
      seam.surfaces.push(face.surface)
      seams.set(key, seam)
    })
  }
  const outline = [...seams.values()]
    .filter(({ surfaces }) => surfaces.length === 1 || surfaces[0] !== surfaces[1])
    .map(({ ends }) => ({ points: ends.map(project), line: true }))
  return [...shapes, ...outline]
}

function formatInches(value) {
  return `${Number(value.toFixed(2))} in.`
}

// The lowest point of the bottom flaps, or the base when they are shut.
function floorZ(state) {
  if (isSolid(state.kind)) return 0
  const points = cartonGeometry(state).bottom.flatMap((flap) => flap.points)
  return Math.min(0, ...points.map(([, , z]) => z))
}

// Every size the visitor can change gets a dimension line. D runs up the front
// corner; L and W run along the base, dropped below any open bottom flap so the
// flaps never cover them, with extension lines back up to the base corners.
function dimensionLines(state) {
  const { w, l, d } = state
  const dims = dimensionsOf(state.kind)
  const offset = DIMENSION_OFFSET
  const floor = floorZ(state)
  const dropped = floor < -0.01
  const extend = (...corners) => (dropped ? corners.map((corner) => [corner, [corner[0], corner[1], floor]]) : [])
  return [
    { from: [0, w + offset, 0], to: [0, w + offset, d], label: `${dims.d.short} ${formatInches(d)}`, anchor: "end", nudge: [-8, 0], extensions: [] },
    {
      from: [0, w + offset, floor],
      to: [l, w + offset, floor],
      label: `${dims.l.short} ${formatInches(l)}`,
      anchor: "end",
      nudge: [-6, 18],
      extensions: extend([0, w + offset, 0], [l, w + offset, 0]),
    },
    {
      from: [l + offset, 0, floor],
      to: [l + offset, w, floor],
      label: `${dims.w.short} ${formatInches(w)}`,
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
  const kind = KINDS[state.kind]
  const open = state.topLid > 0.5 || state.bottomLid > 0.5
  const condition = isSolid(state.kind) ? "" : !hasFlaps(state.kind) ? " open at both ends" : open ? " with its top and bottom flaps open" : " assembled"
  const name = kind.styles ? `${kind.styles[state.style].toLowerCase()} carton` : kind.label
  const dims = dimensionsOf(state.kind)
  const sizes = [...dims.order, ...(dims.fixed ?? [])].map((key) => `${formatInches(state[key])} ${dims[key].word}`)
  const sizeText = `${sizes.slice(0, -1).join(", ")} and ${sizes[sizes.length - 1]}`
  return `Isometric model of a ${name}${condition}, ${sizeText}, drawn to scale.`
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

  const polygons = shapes
    .map((shape) =>
      shape.line
        ? `<polyline points="${pointsAttr(shape.points)}" fill="none"/>`
        : `<polygon points="${pointsAttr(shape.points)}" fill="${shape.fill}"${shape.stroke ? ` stroke="${shape.stroke}"` : ""}/>`,
    )
    .join("")

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

// Only a size listed in the table has an item; any other size has none. A kind
// that turns also matches a listed size on its side (width and height swapped).
export function itemForSize(sizes, { w, l, d, kind }) {
  const turns = Boolean(kind && KINDS[kind]?.turns)
  const matches = (size) => size.w === w && ((size.l === l && size.d === d) || (turns && size.l === d && size.d === l))
  return sizes.find(matches)?.item ?? null
}

export function sizeMessage(item) {
  return item ? `Priced as ${item} in the table below.` : ""
}

const distance = (a, b) => Math.hypot(a.w - b.w, a.l - b.l, a.d - b.d)

// The listed size to step to from the drawn one. From a listed size, the step
// goes to the nearest size of the adjacent item code, next (direction 1) or previous (-1).
// From an unlisted size, it rounds up to the nearest listed size that holds it,
// or down to the nearest one it holds. Null when there is nowhere to go.
// Items in natural order: U5513 before U5514, and "8 x 8" before "10 x 10".
const compareItems = (a, b) => a.localeCompare(b, "en", { numeric: true })
const itemOrder = (sizes) => [...new Set(sizes.map((size) => size.item))].sort(compareItems)

function sizesOfAdjacentItem(sizes, item, direction) {
  const items = itemOrder(sizes)
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
    return direction * compareItems(other.item, best.item) < 0 ? other : best
  })
}

// A size the way the kind writes it, such as "2 x 2 x 5 in." or "8 x 10 in.".
const formatSize = (state, unit) => `${dimensionsOf(state.kind).order.map((key) => state[key]).join(" x ")} ${unit}`

// Shown in place of prices when the drawn size is not a row of the size table.
export function customSizeMessage(state, unit) {
  return `This size isn't in our price table, but we make them to any size. Send us the ${formatSize(state, unit)} size and the quantity you need, and we'll price it for you.`
}

// What the quote form receives as the product, so the request names the size.
export function customSizeProduct(productName, state, unit) {
  const styleLabel = KINDS[state.kind].styles?.[state.style]
  return [productName, styleLabel?.toLowerCase(), formatSize(state, unit)].filter(Boolean).join(", ")
}

export function sizeLimits(sizes) {
  return {
    w: Math.max(...sizes.map((size) => size.w)),
    l: Math.max(...sizes.map((size) => size.l)),
    d: Math.max(...sizes.map((size) => size.d)),
  }
}
