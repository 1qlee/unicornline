import { escapeHtml as e } from "../format.mjs"
import { homePath, viewerPath, absoluteUrl } from "../urls.mjs"

const FONT_PRELOAD = "/fonts/archivo-latin-wdth-normal.woff2"

function header({ config, company }) {
  return `<header class="hdr">
<div class="wrap hdr-in">
<a href="${e(config.mainSiteUrl)}" aria-label="${e(company.owner)} home" style="display:flex;align-items:center"><img src="/images/logo.png" alt="${e(company.owner)}" width="56" height="56" style="height:56px;width:auto;display:block"></a>
<nav aria-label="Main">
<a href="${homePath()}">Catalog</a>
<a href="${e(viewerPath(company.fullCatalog.key))}">Full catalog (PDF)</a>
<a href="${e(config.mainSiteUrl)}">${e(company.owner)}</a>
</nav>
<div class="hdr-cta">
<a class="hdr-phone" href="tel:${e(company.phoneE164)}">${e(company.phone)}</a>
<a href="${e(config.quoteUrl)}" class="btn" style="min-height:46px;font-size:16px;padding:0 20px">Get a free quote</a>
</div>
</div>
</header>`
}

function footer({ config, company }) {
  return `<footer class="wrap" style="padding-bottom:48px">
<div class="rule" aria-hidden="true" style="margin-bottom:64px"></div>
<div style="display:flex;flex-wrap:wrap;gap:40px 72px;justify-content:space-between">
<div style="display:flex;flex-direction:column;gap:12px;max-width:22em">
<img src="/images/logo.png" alt="${e(company.owner)}" width="110" height="110" style="height:110px;width:auto;display:block;align-self:flex-start">
<p style="font-size:15px">${e(company.address)}</p>
<p style="font-size:15px"><a href="tel:${e(company.phoneE164)}">${e(company.phone)}</a></p>
</div>
<nav aria-label="Footer" style="display:flex;flex-wrap:wrap;gap:40px 72px;font-size:15px">
<div style="display:flex;flex-direction:column;gap:8px">
<p style="font-weight:700">Catalog</p>
<a href="${homePath()}">All products</a>
<a href="${e(viewerPath(company.fullCatalog.key))}">Full catalog (PDF)</a>
<a href="${e(viewerPath(company.terms.key))}">Terms</a>
</div>
<div style="display:flex;flex-direction:column;gap:8px">
<p style="font-weight:700">${e(company.owner)}</p>
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
<link rel="icon" type="image/png" href="/images/logo.png">
<link rel="preload" href="${FONT_PRELOAD}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/catalog.css">
${head}</head>
<body>
<div id="top" style="width:100%;min-width:0;position:relative;overflow-x:clip">
${header({ config, company })}
<main>
${main}
</main>
${footer({ config, company })}
</div>
${scripts.map((src) => `<script type="module" src="${e(src)}"></script>`).join("\n")}
</body>
</html>
`
}
