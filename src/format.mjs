const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
]

export function numberWord(count) {
  return NUMBER_WORDS[count] ?? String(count)
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Quantity headings are stored as bare digits ("10000"); the design shows "10,000".
export function formatQuantityLabel(label) {
  return /^\d+$/.test(label) ? Number(label).toLocaleString("en-US") : label
}

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPES[character])
}
