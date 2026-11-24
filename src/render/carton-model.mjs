import { escapeHtml as e } from "../format.mjs"
import { renderCartonSvg, cartonState, itemForSize, sizeLimits, sizeMessage, STYLES, VIEWS } from "../../static/js/carton.js"

const SIZE_STEP = 0.25
const MIN_SIZE = 1
const DEFAULT_STYLE = "straight"
const DEFAULT_VIEW = "open"
const DIMENSIONS = [
  ["w", "Width (W)"],
  ["l", "Length (L)"],
  ["d", "Depth (D)"],
]

function segmented(name, legend, options, selected) {
  const inputs = Object.entries(options)
    .map(
      ([value, label]) => `<label><input type="radio" name="${name}" value="${e(value)}"${value === selected ? " checked" : ""}><span>${e(label)}</span></label>`,
    )
    .join("")
  return `<fieldset class="seg"><legend>${legend}</legend><div>${inputs}</div></fieldset>`
}

function defaultState(model) {
  return cartonState(model.defaultSize, DEFAULT_STYLE, DEFAULT_VIEW)
}

// Interactive, to-scale carton drawing: the first slot of the product gallery.
// The server renders the default size so the drawing shows without JavaScript;
// carton-view.js redraws it as the controls change.
export function cartonModelPanel(model) {
  return `<div class="stage-model" data-carton-stage data-gallery-model>${renderCartonSvg(defaultState(model))}</div>`
}

export function cartonModelThumb(model) {
  return `<li><a href="#carton-controls" class="thumb-model" data-model aria-current="true" aria-label="Show the to-scale carton model">${renderCartonSvg(defaultState(model))}</a></li>`
}

export function cartonModelControls(model) {
  const size = model.defaultSize
  const limits = sizeLimits(model.sizes)
  const styleOptions = Object.fromEntries(Object.entries(STYLES).map(([key, style]) => [key, style.label]))
  const sizeInputs = DIMENSIONS.map(
    ([key, label]) => `<label class="dim-field"><span>${label}</span><span class="dim-input"><input type="number" name="${key}" value="${size[key]}" min="${MIN_SIZE}" max="${limits[key]}" step="${SIZE_STEP}" inputmode="decimal"><span aria-hidden="true">${e(model.unit)}</span></span></label>`,
  ).join("")
  const sizesJson = JSON.stringify(model.sizes).replace(/</g, "\\u003c")

  return `<form class="carton-controls" id="carton-controls" aria-label="Carton model" data-carton-controls>
${segmented("style", "Style", styleOptions, DEFAULT_STYLE)}
${segmented("view", "View", VIEWS, DEFAULT_VIEW)}
<fieldset class="dims"><legend class="vh">Size in inches</legend><div>${sizeInputs}</div></fieldset>
<p class="carton-item" aria-live="polite" data-carton-item>${e(sizeMessage(itemForSize(model.sizes, size)))}</p>
<p class="carton-note">Drawn to scale. Any in-between size is possible.</p>
</form>
<script type="application/json" data-carton-sizes>${sizesJson}</script>`
}
