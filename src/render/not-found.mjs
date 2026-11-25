import { homePath } from "../urls.mjs"
import { renderPage } from "./layout.mjs"

export function renderNotFound(catalog, config) {
  return renderPage({
    config,
    company: catalog.company,
    title: `Page not found | ${catalog.company.name}`,
    description: "This page doesn't exist.",
    path: "/404.html",
    head: '<meta name="robots" content="noindex">\n',
    main: `<section class="wrap sec nf">
<div class="stack-6">
<h1 class="display-md">Page not found</h1>
<p class="lead">This page doesn't exist or has moved. Every product is listed in the catalog.</p>
<a class="btn" href="${homePath()}">Go to the catalog</a>
</div>
</section>`,
  })
}
