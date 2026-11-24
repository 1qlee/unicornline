// Animates the carton model between states as the visitor changes style, view or
// size, and highlights the matching row in the pricing table.

import { renderCartonSvg, cartonViewBox, cartonState, itemForSize, sizeLimits, sizeMessage } from "/js/carton.js"
import { priceRowHtml } from "/js/price-row.js"
import "/js/segmented.js"

const MIN_SIZE = 1
const FOLD_DURATION_MS = 1100
const RESIZE_DURATION_MS = 450
const FOLDS = ["topLid", "topDust", "bottomLid", "bottomDust"]
const SIZES = ["w", "l", "d"]

// Real cartons open lid first, then the dust flaps; they close in reverse.
// Each fold moves within its own window of the animation's 0..1 timeline.
const OPENING_WINDOWS = { Lid: [0, 0.6], Dust: [0.4, 1] }
const CLOSING_WINDOWS = { Dust: [0, 0.5], Lid: [0.4, 1] }

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (value) => Math.min(1, Math.max(0, value))
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

function windowFor(key, from, to) {
  if (SIZES.includes(key)) return [0, 1]
  const part = key.endsWith("Lid") ? "Lid" : "Dust"
  return (to > from ? OPENING_WINDOWS : CLOSING_WINDOWS)[part]
}

function interpolate(from, to, progress) {
  const state = { ...to }
  for (const key of [...SIZES, ...FOLDS]) {
    const [start, end] = windowFor(key, from[key], to[key])
    const local = easeInOut(clamp01((progress - start) / (end - start)))
    state[key] = from[key] + (to[key] - from[key]) * local
  }
  return state
}

// The frame glides from the start fit to the end fit, growing only when a swinging
// flap needs more room, so the carton doesn't pulse in size while it folds.
function frameFor(state, fromFrame, toFrame, progress) {
  const eased = easeInOut(progress)
  const [x, y, width, height] = fromFrame.map((value, index) => value + (toFrame[index] - value) * eased)
  const [fx, fy, fWidth, fHeight] = cartonViewBox(state)
  const left = Math.min(x, fx)
  const top = Math.min(y, fy)
  const right = Math.max(x + width, fx + fWidth)
  const bottom = Math.max(y + height, fy + fHeight)
  return [left, top, right - left, bottom - top]
}

function createAnimator(draw, initial) {
  let current = { ...initial }
  let frame = null
  let run = 0

  function tween(target, duration) {
    const from = { ...current }
    const fromFrame = cartonViewBox(from)
    const toFrame = cartonViewBox(target)
    const started = performance.now()
    const token = run
    return new Promise((resolve) => {
      function step(now) {
        if (token !== run) return resolve(false)
        const progress = clamp01((now - started) / duration)
        current = interpolate(from, target, progress)
        draw(current, frameFor(current, fromFrame, toFrame, progress))
        if (progress < 1) frame = requestAnimationFrame(step)
        else resolve(true)
      }
      frame = requestAnimationFrame(step)
    })
  }

  // Switching tuck style folds the bottom shut, moves its hinge, then reopens it.
  async function animateTo(target) {
    run++
    cancelAnimationFrame(frame)
    if (prefersReducedMotion()) {
      current = { ...target }
      draw(current)
      return
    }
    const folding = FOLDS.some((key) => Math.abs(target[key] - current[key]) > 0.001)
    const duration = folding || current.style !== target.style ? FOLD_DURATION_MS : RESIZE_DURATION_MS
    if (current.style !== target.style) {
      const shut = { ...target, style: current.style, bottomLid: 0, bottomDust: 0 }
      const finished = await tween(shut, FOLD_DURATION_MS)
      if (!finished) return
      current = { ...current, style: target.style }
    }
    await tween(target, duration)
  }

  return { animateTo }
}

function setUpCarton(root) {
  const form = root.querySelector("[data-carton-controls]")
  const stage = root.querySelector("[data-carton-stage]")
  const itemLine = root.querySelector("[data-carton-item]")
  const sizes = JSON.parse(root.querySelector("[data-carton-sizes]").textContent)
  const limits = sizeLimits(sizes)
  const pricesBox = root.querySelector("[data-carton-prices]")
  const priceRows = [...document.querySelectorAll(".ptable tbody tr")]
  const priceColumns = [...document.querySelectorAll(".ptable thead th")].map((cell) => ({
    label: cell.textContent.trim(),
    quantity: cell.classList.contains("num"),
  }))

  function readTarget() {
    const value = (name) => {
      const number = Number(form.elements[name].value)
      return Number.isFinite(number) && number >= MIN_SIZE ? Math.min(number, limits[name] * 2) : MIN_SIZE
    }
    const size = { w: value("w"), l: value("l"), d: value("d") }
    return cartonState(size, form.elements.style.value, form.elements.view.value)
  }

  function showPrice(target) {
    const item = itemForSize(sizes, target)
    itemLine.textContent = sizeMessage(item)
    itemLine.hidden = !item
    const matches = priceRows.filter((row) => Boolean(item) && row.cells[0]?.textContent.trim() === item)
    for (const row of priceRows) row.classList.toggle("is-match", matches.includes(row))
    const cells = matches.map((row) => [...row.cells].map((cell) => cell.textContent.trim()))
    pricesBox.innerHTML = priceRowHtml(priceColumns, cells)
  }

  const initial = readTarget()
  const animator = createAnimator((state, frame) => {
    stage.innerHTML = renderCartonSvg(state, frame)
  }, initial)

  form.addEventListener("input", () => {
    const target = readTarget()
    showPrice(target)
    animator.animateTo(target)
  })
  form.addEventListener("submit", (event) => event.preventDefault())
  showPrice(initial)
}

document.querySelectorAll("[data-carton]").forEach(setUpCarton)
