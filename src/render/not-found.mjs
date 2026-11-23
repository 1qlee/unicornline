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
    main: `<section class="wrap sec" style="padding-top:72px">
<h1 class="disp reg pname">Page not found</h1>
<p class="lede" style="margin:26px 0">This page doesn't exist or has moved. Every product is listed in the catalog.</p>
<a class="btn" href="${homePath()}">Go to the catalog</a>
</section>`,
  })
}
