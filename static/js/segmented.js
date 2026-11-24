// The design system's SegmentedControl: radio buttons in an ink-bordered row,
// with an ink indicator that slides to the selected option. Without this script
// the selected option is filled by CSS alone, so the control still works.

function placeIndicator(root, indicator) {
  const selected = root.querySelector("input:checked")?.closest(".sc-item")
  if (!selected) return
  indicator.style.width = `${selected.offsetWidth}px`
  indicator.style.height = `${selected.offsetHeight}px`
  indicator.style.transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop}px)`
}

function setUpSegmentedControl(root) {
  const indicator = document.createElement("span")
  indicator.className = "sc-indicator"
  indicator.setAttribute("aria-hidden", "true")
  root.prepend(indicator)
  placeIndicator(root, indicator)
  // The first placement must not animate, so motion starts after it is drawn.
  requestAnimationFrame(() => root.setAttribute("data-initialized", ""))
  root.addEventListener("change", () => placeIndicator(root, indicator))
  new ResizeObserver(() => placeIndicator(root, indicator)).observe(root)
}

document.querySelectorAll("[data-segmented]").forEach(setUpSegmentedControl)
