import { escapeHtml as e } from "../format.mjs"
import { homePath } from "../urls.mjs"
import { renderPage } from "./layout.mjs"

// Every PDF the site links to, with a readable title. The viewer only opens these.
export function collectDocuments(catalog) {
  const documents = {
    [catalog.company.fullCatalog.key]: "Full catalog",
    [catalog.company.terms.key]: "Terms",
  }
  for (const product of catalog.products) {
    const { catalogPage, fullCatalog } = product.documents
    if (catalogPage) documents[catalogPage.key] ??= `${product.name}: catalog page`
    if (fullCatalog) documents[fullCatalog.key] ??= "Full catalog"
  }
  return Object.fromEntries(Object.entries(documents).filter(([key]) => key.toLowerCase().endsWith(".pdf")))
}

export function renderViewer(catalog, config) {
  const documents = JSON.stringify(collectDocuments(catalog)).replace(/</g, "\\u003c")
  const main = `<div class="vbar">
<div class="wrap vbar-in">
<h1 class="heading-sm" data-viewer-title>Document</h1>
<div class="vtools">
<a href="${homePath()}" data-viewer-back>Back to catalog</a>
<span aria-live="polite" data-viewer-page></span>
<button type="button" data-viewer-zoom="out" aria-label="Zoom out">&minus;</button>
<button type="button" data-viewer-zoom="in" aria-label="Zoom in">+</button>
<button type="button" data-viewer-zoom="fit" class="vfit">Fit to width</button>
<a href="#" data-viewer-download>Download PDF</a>
</div>
</div>
</div>
<div class="vpages">
<div class="wrap">
<p class="vstatus" data-viewer-status><span class="loader" aria-hidden="true"><span></span><span></span><span></span><span></span></span>Loading document</p>
<div data-viewer-pages></div>
</div>
</div>
<script type="application/json" id="viewer-documents">${documents}</script>`

  return renderPage({
    config,
    company: catalog.company,
    title: `Document viewer | ${catalog.company.name}`,
    description: "View catalog documents.",
    path: "/viewer/",
    main,
    head: `<meta name="robots" content="noindex">\n<meta name="asset-base-url" content="${e(config.assetBaseUrl)}">\n`,
    scripts: ["/js/viewer.js"],
  })
}
