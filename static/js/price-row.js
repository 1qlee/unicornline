// Renders the pricing-table rows for one item as quantity and price pairs, so the
// carton controls can show the prices for the size being drawn. Shared by the
// build (first paint) and the browser (after each change).

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPES[character])

// columns: [{ label, quantity }] in table order; rows: arrays of cell text, item first.
export function priceRowHtml(columns, rows) {
  return rows
    .map((cells) => {
      const details = columns
        .map((column, index) => ({ column, cell: cells[index] }))
        .filter(({ column }, index) => index > 0 && !column.quantity)
        .map(({ cell }) => cell)
      const pairs = columns
        .map((column, index) => (column.quantity ? `<div><dt>${escape(column.label)}</dt><dd>${escape(cells[index])}</dd></div>` : ""))
        .join("")
      const caption = [`Prices for ${cells[0]}`, ...details].join(", ")
      return `<p class="label">${escape(caption)}</p><dl class="price-row">${pairs}</dl>`
    })
    .join("")
}
