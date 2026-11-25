// Turns validated content into the shape the pages need: categories with their
// products in display order, and each product's category neighbours.

const byName = (a, b) => a.name.localeCompare(b.name, "en", { numeric: true, sensitivity: "base" })

export function buildCatalog({ company, categories, products }) {
  const allProducts = products.map(({ data }) => data).sort(byName)
  const productBySlug = new Map(allProducts.map((product) => [product.slug, product]))

  const orderedCategories = [...categories].sort(byName).map((category) => ({
    ...category,
    drawing: `category-${category.slug}.svg`,
    products: allProducts.filter((product) => product.categories.includes(category.slug)),
  }))
  const categoryBySlug = new Map(orderedCategories.map((category) => [category.slug, category]))

  return {
    company,
    categories: orderedCategories,
    products: allProducts,
    categoryOf: (product) => categoryBySlug.get(product.categories[0]),
    productBySlug: (slug) => productBySlug.get(slug),
    categoryBySlug: (slug) => categoryBySlug.get(slug),
    neighbours: (product) => neighboursWithin(categoryBySlug.get(product.categories[0]).products, product),
  }
}

// Previous and next wrap around within the product's primary category.
export function neighboursWithin(siblings, product) {
  const index = siblings.indexOf(product)
  if (siblings.length < 2) return { previous: null, next: null }
  return {
    previous: siblings[(index - 1 + siblings.length) % siblings.length],
    next: siblings[(index + 1) % siblings.length],
  }
}
