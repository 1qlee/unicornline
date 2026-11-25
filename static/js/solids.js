// Rigid products with no moving parts, as closed solids in inches. Same axes as
// carton.js: x along L, y along W, z up along D, viewed from (+1, +1, +1).
//
// Each builder returns faces as { points, surface, printed? }. Faces that share a
// `surface` belong to one smooth surface, so the seams between them are not drawn;
// `printed` marks where the product carries its print.

// Facets across the pillow box's curved panels and ends.
const PILLOW_STEPS = 16
// How far a pillow box end curves in, as a share of its width, capped by length.
const PILLOW_END_BOW = 0.28
const PILLOW_END_BOW_MAX_LENGTH = 0.16

// Favor box: a wedge, like a slice of cake. The wide end (W x D) faces right and
// the slice narrows to an upright edge at x = 0.
export function favorSolid({ w, l, d }) {
  const tip = (z) => [0, w / 2, z]
  return [
    { points: [tip(0), [l, w, 0], [l, 0, 0]], surface: "bottom" },
    { points: [tip(d), [l, 0, d], [l, w, d]], surface: "top" },
    { points: [[l, 0, 0], [l, w, 0], [l, w, d], [l, 0, d]], surface: "end" },
    { points: [tip(0), [l, 0, 0], [l, 0, d], tip(d)], surface: "back" },
    { points: [tip(0), tip(d), [l, w, d], [l, w, 0]], surface: "front", printed: true },
  ]
}

// Pillow box: a lens-shaped tube, thickest along its middle and pinched to a seam at
// both long edges, closed by ends that curve inward.
export function pillowSolid({ w, l, d }) {
  const bow = Math.min(w * PILLOW_END_BOW, l * PILLOW_END_BOW_MAX_LENGTH)
  const ys = Array.from({ length: PILLOW_STEPS + 1 }, (_, index) => (w * index) / PILLOW_STEPS)
  const swell = (y) => 1 - (2 * y / w - 1) ** 2
  const top = (y) => d / 2 + (d / 2) * swell(y)
  const bottom = (y) => d / 2 - (d / 2) * swell(y)
  const nearEnd = (y) => bow * swell(y)
  const farEnd = (y) => l - bow * swell(y)
  const faces = []
  ys.slice(0, -1).forEach((y0, index) => {
    const y1 = ys[index + 1]
    faces.push({ points: [[nearEnd(y0), y0, top(y0)], [nearEnd(y1), y1, top(y1)], [farEnd(y1), y1, top(y1)], [farEnd(y0), y0, top(y0)]], surface: "top" })
    faces.push({ points: [[nearEnd(y0), y0, bottom(y0)], [farEnd(y0), y0, bottom(y0)], [farEnd(y1), y1, bottom(y1)], [nearEnd(y1), y1, bottom(y1)]], surface: "bottom" })
    faces.push({ points: [[farEnd(y0), y0, bottom(y0)], [farEnd(y0), y0, top(y0)], [farEnd(y1), y1, top(y1)], [farEnd(y1), y1, bottom(y1)]], surface: "far end" })
    faces.push({ points: [[nearEnd(y0), y0, bottom(y0)], [nearEnd(y1), y1, bottom(y1)], [nearEnd(y1), y1, top(y1)], [nearEnd(y0), y0, top(y0)]], surface: "near end" })
  })
  return faces.filter((face) => !isDegenerate(face.points))
}

// A wall panel standing upright: L wide, D high, W thick, printed on the front.
export function panelSolid({ w, l, d }) {
  const box = (x0, y0, z0, x1, y1, z1) => [
    { points: [[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]], surface: "bottom" },
    { points: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], surface: "top" },
    { points: [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], surface: "front", printed: true },
    { points: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], surface: "back" },
    { points: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], surface: "right" },
    { points: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], surface: "left" },
  ]
  return box(0, 0, 0, l, w, d)
}

// A pinched seam collapses a facet to a line; drop it.
function isDegenerate(points) {
  const unique = new Set(points.map((point) => point.map((value) => value.toFixed(6)).join(",")))
  return unique.size < 3
}

export const SOLIDS = { favor: favorSolid, pillow: pillowSolid, panel: panelSolid }
