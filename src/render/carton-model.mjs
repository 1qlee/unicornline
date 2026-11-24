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

// Interactive, to-scale carton drawing. The server renders the default size so
// the drawing shows without JavaScript; carton-view.js redraws it as inputs change.
export function cartonModelRow(model) {
  const size = model.defaultSize
  const limits = sizeLimits(model.sizes)
  const styleOptions = Object.fromEntries(Object.entries(STYLES).map(([key, style]) => [key, style.label]))
  const sizeInputs = DIMENSIONS.map(
    ([key, label]) => `<label class="dim-field"><span>${label}</span><span class="dim-input"><input type="number" name="${key}" value="${size[key]}" min="${MIN_SIZE}" max="${limits[key]}" step="${SIZE_STEP}" inputmode="decimal"><span aria-hidden="true">${e(model.unit)}</span></span></label>`,
  ).join("")
  const sizesJson = JSON.stringify(model.sizes).replace(/</g, "\\u003c")

  return `<div class="srow">
<h3 style="font-size:20px">Size it up</h3>
<div class="carton" data-carton>
<div class="carton-stage" data-carton-stage>${renderCartonSvg(cartonState(size, DEFAULT_STYLE, DEFAULT_VIEW))}</div>
<form class="carton-controls" data-carton-controls>
${segmented("style", "Style", styleOptions, DEFAULT_STYLE)}
${segmented("view", "View", VIEWS, DEFAULT_VIEW)}
<fieldset class="dims"><legend>Size in inches</legend><div>${sizeInputs}</div></fieldset>
<p class="carton-item" aria-live="polite" data-carton-item>${e(sizeMessage(itemForSize(model.sizes, size)))}</p>
<p class="carton-note">Drawn to scale. Any in-between size is possible.</p>
</form>
<script type="application/json" data-carton-sizes>${sizesJson}</script>
</div>
</div>`
}
