import { escapeHtml as e, formatQuantityLabel } from "../format.mjs"
import { productPath, homePath, assetUrl, viewerPath, quoteUrlFor } from "../urls.mjs"
import { variantKey, widthsFor } from "../images.mjs"
import { renderPage } from "./layout.mjs"
import { cartonModelPanel, cartonModelThumb, cartonModelControls } from "./carton-model.mjs"

const MAIN_IMAGE_SIZES = "(max-width: 900px) calc(100vw - 64px), 520px"
const PRICES_CURRENCY_NOTE = "Prices in USD."
const DOCUMENT_LABELS = [
  ["template", "Template"],
  ["catalogPage", "Catalog page"],
  ["fullCatalog", "Full catalog"],
]

function srcset(config, image) {
  return widthsFor(image)
    .map((width) => `${assetUrl(config.assetBaseUrl, variantKey(image.key, width))} ${width}w`)
    .join(", ")
}

function largestUrl(config, image) {
  const widths = widthsFor(image)
  return assetUrl(config.assetBaseUrl, variantKey(image.key, widths[widths.length - 1]))
}

function mainImageUrl(config, image) {
  const widths = widthsFor(image)
  const preferred = widths.find((width) => width >= 640) ?? widths[widths.length - 1]
  return assetUrl(config.assetBaseUrl, variantKey(image.key, preferred))
}

function breadcrumb(product, category) {
  return `<nav class="crumbs" aria-label="Breadcrumb">
<a href="${homePath()}">Catalog</a><span aria-hidden="true">/</span>
<a href="${homePath()}#${e(category.slug)}">${e(category.name)}</a><span aria-hidden="true">/</span>
<span aria-current="page">${e(product.name)}</span>
</nav>`
}

// PDFs open in the site's viewer; anything else (template ZIPs) downloads directly.
function documentHref(config, file, backPath) {
  if (file.key.toLowerCase().endsWith(".pdf")) return viewerPath(file.key, backPath)
  return assetUrl(config.assetBaseUrl, file.key)
}

function documentLinks(product, company, config) {
  const back = productPath(product)
  const links = DOCUMENT_LABELS.filter(([field]) => product.documents[field]).map(
    ([field, label]) => `<a href="${e(documentHref(config, product.documents[field], back))}">${label}</a>`,
  )
  links.splice(1, 0, `<a href="${e(viewerPath(company.terms.key, back))}">Terms</a>`)
  return `<div class="dl">${links.join("")}</div>`
}

function photoThumb(config, image, index, current) {
  return `<li><a href="${e(largestUrl(config, image))}" data-full="${e(mainImageUrl(config, image))}" data-srcset="${e(srcset(config, image))}" data-alt="${e(image.alt)}" data-width="${image.width}" data-height="${image.height}"${current ? ' aria-current="true"' : ""}><img src="${e(assetUrl(config.assetBaseUrl, variantKey(image.key, widthsFor(image)[0])))}" alt="Show photo ${index + 1}: ${e(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"></a></li>`
}

// Videos sit at the end of the carousel. Without JavaScript the thumbnail links to YouTube.
function videoThumb(product, id, index, total) {
  const label = `Play video${total > 1 ? ` ${index + 1} of ${total}` : ""}: ${product.name}`
  return `<li><a class="thumb-video" href="https://www.youtube.com/watch?v=${e(id)}" data-video="${e(id)}" data-title="${e(label.replace(/^Play /, ""))}"><img src="https://i.ytimg.com/vi/${e(id)}/mqdefault.jpg" alt="${e(label)}" width="320" height="180" loading="lazy" decoding="async"><span class="thumb-play" aria-hidden="true"></span></a></li>`
}

// With a carton model, the interactive drawing takes the first slot and the
// first photo waits, hidden, until its thumbnail is chosen.
function gallery(product, config) {
  const images = product.images.length ? product.images : [product.thumbnail]
  const [first] = images
  const { model } = product
  const items = [
    ...(model ? [cartonModelThumb(model)] : []),
    ...images.map((image, index) => photoThumb(config, image, index, !model && index === 0)),
    ...product.videos.map((id, index) => videoThumb(product, id, index, product.videos.length)),
  ]
  const thumbs = items.length > 1 ? `<ul class="thumbs" aria-label="Product photos and videos">${items.join("")}</ul>` : ""
  const mainImage = `<img src="${e(mainImageUrl(config, first))}" srcset="${e(srcset(config, first))}" sizes="${MAIN_IMAGE_SIZES}" alt="${e(first.alt)}" width="${first.width}" height="${first.height}"${model ? " hidden" : ' fetchpriority="high"'} data-gallery-main>`
  return `<div>
<div class="pstage2" data-gallery-stage>${model ? cartonModelPanel(model) : ""}${mainImage}</div>
${thumbs}
</div>`
}

function quoteAction(product, company, config) {
  return `<div class="pcta">
<a href="${e(quoteUrlFor(config.quoteUrl, product.name))}" class="btn">Get a free quote</a>
<p>Or call <a href="tel:${e(company.phoneE164)}">${e(company.phone)}</a></p>
</div>`
}

// A product with a carton model puts the model's controls where the quote button
// would be; the header still carries the quote button and phone number.
function productTop(product, category, catalog, config) {
  const { company } = catalog
  const { model } = product
  return `<section class="wrap ptop-sec">
${breadcrumb(product, category)}
<div class="ptop"${model ? " data-carton" : ""}>
<div class="stack-6">
<h1 class="display-md">${e(product.name)}</h1>
<p class="lead">${e(product.description)}</p>
${model ? cartonModelControls(model, { pricing: product.pricing, productName: product.name, quoteUrl: config.quoteUrl }) : quoteAction(product, company, config)}
</div>
${gallery(product, config)}
</div>
</section>`
}

function specRow(label, items) {
  return `<div class="srow">
<h3 class="heading-sm">${label}</h3>
<ul>${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>
</div>`
}

function details(product, company, config) {
  const { specs } = product
  const groups = [
    ["Specifications", specs.features],
    ["Materials", specs.materials],
    ["Printing", specs.printing],
    ["Custom shape", specs.customShape ? [specs.customShape] : []],
    ["Options", specs.options],
  ].filter(([, items]) => items.length > 0)

  // notesHtml is authored in content/ (trusted), so it is inserted as HTML.
  const notes = product.notesHtml
    ? `<div class="srow">
<h3 class="heading-sm">Good to know</h3>
<div class="prose">${product.notesHtml}</div>
</div>`
    : ""

  return `<section class="half" aria-labelledby="spec-h">
<div class="rule" aria-hidden="true"></div>
<h2 id="spec-h" class="heading-xl sec-head">What you get</h2>
${groups.map(([label, items]) => specRow(label, items)).join("\n")}
${notes}
<div class="srow">
<h3 class="heading-sm">Documents</h3>
${documentLinks(product, company, config)}
</div>
</section>`
}

function priceTable(pricing, productName) {
  const head = pricing.columns
    .map((column) =>
      column.method
        ? `<th scope="col" class="num">${e(formatQuantityLabel(column.label))}</th>`
        : `<th scope="col" class="col-text">${e(column.label)}</th>`,
    )
    .join("")
  const body = pricing.rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, index) => `<td${pricing.columns[index].method ? ' class="num"' : ""}>${e(cell)}</td>`)
          .join("")}</tr>`,
    )
    .join("\n")
  return `<div class="pscroll" tabindex="0" role="region" aria-label="Pricing table for ${e(productName)}, scrolls sideways">
<table class="ptable">
<thead><tr>${head}</tr></thead>
<tbody>
${body}
</tbody>
</table>
</div>`
}

function pricingSection(product) {
  return `<section class="half" aria-labelledby="price-h">
<div class="rule" aria-hidden="true"></div>
<div class="sec-head stack-6">
<h2 id="price-h" class="heading-xl">Pricing by quantity</h2>
<p class="lead">${e(product.pricing.note)} ${PRICES_CURRENCY_NOTE}</p>
</div>
${priceTable(product.pricing, product.name)}
</section>`
}

function neighbourNav(neighbours) {
  if (!neighbours.previous || !neighbours.next) return ""
  return `<nav class="pn" aria-label="More in this category">
<a class="link" href="${e(productPath(neighbours.previous))}">Previous: ${e(neighbours.previous.name)}</a>
<a class="link" href="${e(productPath(neighbours.next))}">Next: ${e(neighbours.next.name)}</a>
</nav>`
}

// What you get and the pricing sit side by side, 50:50, and stack below bp-md.
function detailsAndPricing(product, catalog, config) {
  return `<div class="wrap sec">
<div class="halves">
${details(product, catalog.company, config)}
${pricingSection(product)}
</div>
${neighbourNav(catalog.neighbours(product))}
</div>`
}

export function renderProduct(product, catalog, config) {
  const category = catalog.categoryOf(product)
  return renderPage({
    config,
    company: catalog.company,
    title: `${product.name} | ${catalog.company.name}`,
    description: product.description,
    path: productPath(product),
    main: [
      productTop(product, category, catalog, config),
      detailsAndPricing(product, catalog, config),
    ].join("\n"),
    scripts: product.model ? ["/js/site.js", "/js/carton-view.js"] : ["/js/site.js"],
  })
}
