import { escapeHtml as e, formatQuantityLabel } from "../format.mjs"
import { priceRowHtml } from "../../static/js/price-row.js"
import { renderCartonSvg, cartonState, itemForSize, steppedSize, sizeLimits, sizeMessage, customSizeMessage, customSizeProduct, KINDS, VIEWS, hasFlaps } from "../../static/js/carton.js"
import { quoteUrlFor } from "../urls.mjs"

const SIZE_STEP = 0.25
const MIN_SIZE = 1
const DEFAULT_VIEW = "open"
const DIMENSIONS = [
  ["w", "Width (W)"],
  ["l", "Length (L)"],
  ["d", "Depth (D)"],
]

function segmented(name, legend, options, selected) {
  const inputs = Object.entries(options)
    .map(
      ([value, label]) => `<label class="sc-item"><input type="radio" name="${name}" value="${e(value)}"${value === selected ? " checked" : ""}><span>${e(label)}</span></label>`,
    )
    .join("")
  return `<fieldset class="seg"><legend>${legend}</legend><div class="sc" data-segmented>${inputs}</div></fieldset>`
}

// model.type names the carton kind (see KINDS in carton.js).
function defaultState(model) {
  return cartonState(model.defaultSize, model.type, null, DEFAULT_VIEW)
}

// Style shows only for a kind with styles, view only for a kind with flaps.
function choiceControls(model, state) {
  const { styles } = KINDS[model.type]
  return [
    styles ? segmented("style", "Style", styles, state.style) : "",
    hasFlaps(model.type) ? segmented("view", "View", VIEWS, DEFAULT_VIEW) : "",
  ].join("\n")
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

const CHEVRONS = {
  previous: '<path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
  next: '<path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
}
const STEP_LABELS = { previous: "Previous listed item", next: "Next listed item" }
const STEP_DIRECTIONS = { previous: -1, next: 1 }

// Icon buttons that jump the size to the neighbouring listed item; carton-view.js
// keeps their disabled state current. They use aria-disabled rather than the
// disabled attribute, so a button that runs out keeps keyboard focus.
function stepButtons(model) {
  const buttons = Object.keys(CHEVRONS).map((key) => {
    const disabled = !steppedSize(model.sizes, model.defaultSize, STEP_DIRECTIONS[key])
    return `<button type="button" class="icon-btn" aria-label="${STEP_LABELS[key]}" title="${STEP_LABELS[key]}" data-carton-step="${STEP_DIRECTIONS[key]}"${disabled ? ' aria-disabled="true"' : ""}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">${CHEVRONS[key]}</svg></button>`
  })
  return `<div class="dim-steps">${buttons.join("")}</div>`
}

function matchingPrices(pricing, item) {
  const columns = pricing.columns.map((column) => ({ label: formatQuantityLabel(column.label), quantity: Boolean(column.method) }))
  const rows = pricing.rows.filter((row) => row[0] === item)
  return rows.length ? priceRowHtml(columns, rows) : ""
}

export function cartonModelControls(model, { pricing, productName, quoteUrl }) {
  const size = model.defaultSize
  const item = itemForSize(model.sizes, size)
  const limits = sizeLimits(model.sizes)
  const state = defaultState(model)
  const sizeInputs = DIMENSIONS.map(
    ([key, label]) => `<label class="dim-field"><span>${label}</span><span class="dim-input"><input type="number" name="${key}" value="${size[key]}" min="${MIN_SIZE}" max="${limits[key]}" step="${SIZE_STEP}" inputmode="decimal"><span aria-hidden="true">${e(model.unit)}</span></span></label>`,
  ).join("")
  const sizesJson = JSON.stringify(model.sizes).replace(/</g, "\\u003c")

  return `<form class="carton-controls" id="carton-controls" aria-label="Carton model" data-carton-controls data-kind="${e(model.type)}">
${choiceControls(model, state)}
<fieldset class="dims"><legend class="vh">Size in inches</legend><div>${sizeInputs}${stepButtons(model)}</div></fieldset>
<p class="carton-item" aria-live="polite" data-carton-item${item ? "" : " hidden"}>${e(sizeMessage(item))}</p>
<div class="carton-prices" data-carton-prices>${item ? matchingPrices(pricing, item) : ""}</div>
<div class="carton-custom" data-carton-custom data-quote-base="${e(quoteUrl)}" data-product="${e(productName)}" data-unit="${e(model.unit)}"${item ? " hidden" : ""}>
<p data-carton-custom-text>${e(customSizeMessage(size, model.unit))}</p>
<a class="btn" href="${e(quoteUrlFor(quoteUrl, customSizeProduct(productName, state, model.unit)))}" data-carton-custom-link>Get a custom price</a>
</div>
</form>
<script type="application/json" data-carton-sizes>${sizesJson}</script>`
}
