// Redraws the carton model as the visitor changes style, view or size, and
// highlights the matching row in the pricing table.

import { renderCartonSvg, itemForSize, sizeLimits, sizeMessage } from "/js/carton.js"

const MIN_SIZE = 1

function setUpCarton(root) {
  const form = root.querySelector("[data-carton-controls]")
  const stage = root.querySelector("[data-carton-stage]")
  const itemLine = root.querySelector("[data-carton-item]")
  const sizes = JSON.parse(root.querySelector("[data-carton-sizes]").textContent)
  const limits = sizeLimits(sizes)
  const priceRows = [...document.querySelectorAll(".ptable tbody tr")]

  function readSize() {
    const value = (name) => {
      const number = Number(form.elements[name].value)
      return Number.isFinite(number) && number >= MIN_SIZE ? Math.min(number, limits[name] * 2) : MIN_SIZE
    }
    return { w: value("w"), l: value("l"), d: value("d") }
  }

  function update() {
    const size = readSize()
    stage.innerHTML = renderCartonSvg(size, form.elements.style.value, form.elements.view.value)
    const item = itemForSize(sizes, size)
    itemLine.textContent = sizeMessage(item)
    for (const row of priceRows) {
      row.classList.toggle("is-match", Boolean(item) && row.cells[0]?.textContent.trim() === item)
    }
  }

  form.addEventListener("input", update)
  form.addEventListener("submit", (event) => event.preventDefault())
  update()
}

document.querySelectorAll("[data-carton]").forEach(setUpCarton)
