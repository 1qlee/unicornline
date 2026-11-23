// Product photos are served as resized WebP variants from R2. The original key in
// content/ names the photo; these helpers name its variants.

export const IMAGE_WIDTHS = [240, 640, 1280]

export function variantKey(originalKey, width) {
  return `${originalKey.replace(/\.[a-z0-9]+$/i, "")}-${width}.webp`
}

// Variants are never upscaled, so a small original only gets the widths it can fill.
export function widthsFor(image) {
  const fitting = IMAGE_WIDTHS.filter((width) => width <= image.width)
  return fitting.length ? fitting : [IMAGE_WIDTHS[0]]
}

export function productImageKeys(product) {
  const keys = new Set([product.thumbnail.key, ...product.images.map((image) => image.key)])
  return [...keys]
}
