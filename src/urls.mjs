// The single source of truth for every URL the site emits. Pages, nav, breadcrumbs,
// search results and redirects all go through here so they can't drift apart.

export function homePath() {
  return "/"
}

export function categoryPath(categorySlug) {
  return `/${categorySlug}/`
}

// A product listed in several categories lives at its first (primary) category.
export function productPath(product) {
  return `/${product.categories[0]}/${product.slug}/`
}

export function assetUrl(assetBaseUrl, key) {
  return `${assetBaseUrl.replace(/\/+$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`
}

export function viewerPath(fileKey, backPath) {
  const params = new URLSearchParams({ file: fileKey })
  if (backPath) params.set("back", backPath)
  return `/viewer/?${params}`
}

export function absoluteUrl(siteUrl, path) {
  return `${siteUrl.replace(/\/+$/, "")}${path}`
}
