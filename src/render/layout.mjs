import { escapeHtml as e } from "../format.mjs"
import { homePath, viewerPath, absoluteUrl } from "../urls.mjs"

const FONT_PRELOAD = "/fonts/archivo-latin-wdth-normal.woff2"
const LOGO = "/images/logo.svg"
// The logo's intrinsic size, from its viewBox, so the browser reserves its space.
const LOGO_WIDTH = 73
const LOGO_HEIGHT = 72

function header({ config, company }) {
  return `<header class="hdr">
<div class="wrap hdr-in">
<a class="hdr-logo" href="${e(config.mainSiteUrl)}"><img src="${LOGO}" alt="${e(company.owner)}" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}"></a>
<nav aria-label="Main">
<a href="${homePath()}">Catalog</a>
<a href="${e(viewerPath(company.fullCatalog.key))}">Full catalog (PDF)</a>
<a href="${e(config.mainSiteUrl)}">${e(company.owner)}</a>
</nav>
<div class="hdr-cta">
<a class="hdr-phone" href="tel:${e(company.phoneE164)}">${e(company.phone)}</a>
<a href="${e(config.quoteUrl)}" class="btn btn-sm">Get a free quote</a>
</div>
</div>
</header>`
}

function footer({ config, company }) {
  return `<footer class="wrap ftr">
<div class="rule" aria-hidden="true"></div>
<div class="ftr-in">
<div class="ftr-id">
<img src="${LOGO}" alt="${e(company.owner)}" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}">
<p>${e(company.address)}</p>
<p><a href="tel:${e(company.phoneE164)}">${e(company.phone)}</a></p>
</div>
<nav aria-label="Footer">
<div class="ftr-col">
<p>Catalog</p>
<a href="${homePath()}">All products</a>
<a href="${e(viewerPath(company.fullCatalog.key))}">Full catalog (PDF)</a>
<a href="${e(viewerPath(company.terms.key))}">Terms</a>
</div>
<div class="ftr-col">
<p>${e(company.owner)}</p>
<a href="${e(config.mainSiteUrl)}">Homepage</a>
<a href="${e(config.quoteUrl)}">Get a free quote</a>
</div>
</nav>
</div>
</footer>`
}

export function renderPage({ config, company, title, description, path, main, scripts = [], head = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(description)}">
<link rel="canonical" href="${e(absoluteUrl(config.siteUrl, path))}">
<link rel="icon" type="image/svg+xml" href="${LOGO}">
<link rel="alternate icon" type="image/png" href="/images/logo.png">
<link rel="preload" href="${FONT_PRELOAD}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/catalog.css">
${head}</head>
<body>
<div id="top" class="page">
<a class="skip" href="#content">Skip to content</a>
${header({ config, company })}
<main id="content">
${main}
</main>
${footer({ config, company })}
</div>
${scripts.map((src) => `<script type="module" src="${e(src)}"></script>`).join("\n")}
</body>
</html>
`
}
