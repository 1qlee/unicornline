// Checks content/ before anything renders, so a bad edit fails the build with the
// file and field at fault instead of producing a broken page.

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PRINT_METHODS = new Set(["digital", "offset", "inkjet"])

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== ""
}

function isStringList(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function checkImage(image, where, errors) {
  if (!image || !isNonEmptyString(image.key)) return errors.push(`${where}: missing image key`)
  if (!isNonEmptyString(image.alt)) errors.push(`${where}: missing alt text`)
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) {
    errors.push(`${where}: missing image dimensions`)
  }
}

function checkFile(file, where, errors) {
  if (file === null) return
  if (!file || !isNonEmptyString(file.key)) errors.push(`${where}: missing file key`)
}

function checkPricing(pricing, where, errors) {
  if (!pricing || !Array.isArray(pricing.columns) || !Array.isArray(pricing.rows)) {
    return errors.push(`${where}: pricing needs columns and rows`)
  }
  if (!isNonEmptyString(pricing.note)) errors.push(`${where}: missing note`)
  for (const column of pricing.columns) {
    if (column.method !== null && !PRINT_METHODS.has(column.method)) {
      errors.push(`${where}: unknown print method "${column.method}"`)
    }
  }
  pricing.rows.forEach((row, index) => {
    if (!isStringList(row) || row.length !== pricing.columns.length) {
      errors.push(`${where}: row ${index + 1} has ${row.length} cells, expected ${pricing.columns.length}`)
    }
  })
}

function checkProduct(product, file, categorySlugs, errors) {
  const where = file
  if (!SLUG_PATTERN.test(product.slug ?? "")) errors.push(`${where}: invalid slug "${product.slug}"`)
  if (!isNonEmptyString(product.name)) errors.push(`${where}: missing name`)
  if (!Array.isArray(product.categories) || product.categories.length === 0) {
    errors.push(`${where}: needs at least one category`)
  } else {
    for (const slug of product.categories) {
      if (!categorySlugs.has(slug)) errors.push(`${where}: unknown category "${slug}"`)
    }
  }
  const specs = product.specs ?? {}
  for (const list of ["features", "materials", "printing", "options"]) {
    if (!isStringList(specs[list])) errors.push(`${where}: specs.${list} must be a list of strings`)
  }
  checkPricing(product.pricing, `${where} pricing`, errors)
  if (!isStringList(product.videos)) errors.push(`${where}: videos must be a list of YouTube IDs`)
  checkImage(product.thumbnail, `${where} thumbnail`, errors)
  ;(product.images ?? []).forEach((image, index) => checkImage(image, `${where} images[${index}]`, errors))
  for (const [name, document] of Object.entries(product.documents ?? {})) {
    checkFile(document, `${where} documents.${name}`, errors)
  }
}

// products: [{ file, data }] so errors can name the file to fix.
export function validateContent({ company, categories, products }) {
  const errors = []
  const categorySlugs = new Set()

  categories.forEach((category, index) => {
    const where = `categories.json[${index}]`
    if (!SLUG_PATTERN.test(category.slug ?? "")) errors.push(`${where}: invalid slug "${category.slug}"`)
    if (categorySlugs.has(category.slug)) errors.push(`${where}: duplicate slug "${category.slug}"`)
    if (!isNonEmptyString(category.name)) errors.push(`${where}: missing name`)
    categorySlugs.add(category.slug)
  })

  const productSlugs = new Set()
  for (const { file, data } of products) {
    if (productSlugs.has(data.slug)) errors.push(`${file}: duplicate product slug "${data.slug}"`)
    productSlugs.add(data.slug)
    if (file !== `${data.slug}.json`) errors.push(`${file}: file name must match slug "${data.slug}"`)
    checkProduct(data, file, categorySlugs, errors)
  }

  for (const field of ["name", "owner", "lede", "address", "phone", "phoneE164"]) {
    if (!isNonEmptyString(company?.[field])) errors.push(`company.json: missing ${field}`)
  }

  return errors
}
