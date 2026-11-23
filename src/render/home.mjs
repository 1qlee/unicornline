import { escapeHtml as e, numberWord, capitalize } from "../format.mjs"
import { productPath, homePath } from "../urls.mjs"
import { renderPage } from "./layout.mjs"

function featuredHref(item, catalog) {
  if (item.target.product) return productPath(catalog.productBySlug(item.target.product))
  return `${homePath()}#${item.target.category}`
}

function hero(catalog, productCount) {
  const { company, categories } = catalog
  return `<section class="hero" aria-labelledby="hero-h">
<div class="wrap" style="padding-top:72px;padding-bottom:96px;z-index:1">
<div class="sheet">
<h1 id="hero-h" class="disp reg">${e(company.name)}</h1>
<div class="hero-row">
<p class="lede">${e(company.lede)}</p>
<label class="search">
<span class="vh">Search the catalog</span>
<input type="search" placeholder="Search ${productCount} products" autocomplete="off" data-search>
<span aria-live="polite" data-search-count></span>
</label>
</div>
<div class="slug">
<p>${e(capitalize(numberWord(categories.length)))} categories</p>
<p>${productCount} products</p>
<p><a href="tel:${e(company.phoneE164)}">${e(company.phone)}</a></p>
</div>
<img class="hero-art line" src="/drawings/hero-cluster.svg" alt="Isometric drawing of a line-up of catalog items: cartons, a mailer box, a candle, a wooden award cube and a tin" style="object-fit:contain;object-position:right bottom">
</div>
</div>
</section>`
}

function featuredSection(catalog) {
  const tiles = catalog.featured
    .map(
      (item) => `<article class="ftile">
<div style="height:170px;margin-bottom:8px"><img src="/drawings/${e(item.drawing)}" alt="" aria-hidden="true" style="width:100%;height:100%;display:block;object-fit:contain"></div>
<h3 style="font-size:clamp(24px,2.2vw,32px)">${e(item.title)}</h3>
<p style="max-width:24em">${e(item.line)}</p>
<a class="linkbtn" href="${e(featuredHref(item, catalog))}">${e(item.cta)}</a>
</article>`,
    )
    .join("\n")
  return `<section class="wrap sec" aria-labelledby="feat-h">
<div class="rule" aria-hidden="true"></div>
<h2 id="feat-h" class="h2">New and popular in the line</h2>
<div class="feat">
${tiles}
</div>
</section>`
}

function categorySection(category) {
  const items = category.products
    .map((product) => `<li><a class="pitem" href="${e(productPath(product))}"><i aria-hidden="true"></i>${e(product.name)}</a></li>`)
    .join("")
  return `<section class="cat" id="${e(category.slug)}" aria-label="${e(category.name)}" data-category="${e(category.name)}">
<div class="cat-head">
<div style="display:flex;flex-direction:column;gap:14px;min-width:0">
<h3 class="h2" style="font-weight:500">${e(category.name)}</h3>
<p class="lede" style="font-size:19px;max-width:28em">${e(category.description)}</p>
</div>
<img class="cat-art" src="/drawings/${e(category.drawing)}" alt="" aria-hidden="true">
</div>
<ul class="plist3">${items}</ul>
</section>`
}

function indexSection(catalog, productCount) {
  const { categories } = catalog
  const nav = categories
    .map((category) => `<a href="#${e(category.slug)}">${e(category.name)}<span>${category.products.length}</span></a>`)
    .join("")
  return `<section id="index" class="wrap sec" aria-labelledby="index-h">
<div class="rule" aria-hidden="true"></div>
<h2 id="index-h" class="h2">${e(capitalize(numberWord(categories.length)))} categories, ${productCount} products.</h2>
<div class="ix">
<nav class="ixnav" aria-label="Categories">${nav}</nav>
<div>
<div id="no-results" hidden>
<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start;padding-bottom:104px">
<h3 style="font-size:28px">No products match your search.</h3>
<p>Check the spelling or try a broader word, such as "box" or "tea".</p>
<button type="button" class="btn" data-clear-search>Clear search</button>
</div>
</div>
${categories.map(categorySection).join("\n")}
</div>
</div>
</section>`
}

export function renderHome(catalog, config) {
  const productCount = catalog.products.length
  return renderPage({
    config,
    company: catalog.company,
    title: `${catalog.company.name} | ${catalog.company.owner}`,
    description: catalog.company.lede,
    path: homePath(),
    main: [hero(catalog, productCount), featuredSection(catalog), indexSection(catalog, productCount)].join("\n"),
    scripts: ["/js/site.js"],
  })
}

// Old category URLs (/gift-box) now point at the home page section (/#gift-box).
export function renderCategoryRedirect(category, config) {
  const target = `${homePath()}#${category.slug}`
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${e(category.name)} | Unicorn Line</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${e(target)}">
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body><p><a href="${e(target)}">${e(category.name)}</a></p></body>
</html>
`
}
