// In-site PDF viewer built on PDF.js. Pages render lazily as they scroll into
// view, and PDF.js fetches the file in ranges, so large catalogs open quickly.

import * as pdfjs from "/vendor/pdfjs/pdf.min.mjs"

pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.mjs"

// Zoom is relative to the page fitting the viewer width, so 1 means "fit to width".
const FIT_WIDTH_ZOOM = 1
const ZOOM_STEP = 0.25
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const RENDER_MARGIN = "800px 0px"
const SAFE_KEY = /^files\/[a-z0-9][a-z0-9/_.-]*\.pdf$/i

const status = document.querySelector("[data-viewer-status]")
const pagesHolder = document.querySelector("[data-viewer-pages]")
const pageLabel = document.querySelector("[data-viewer-page]")

function readRequest() {
  const params = new URLSearchParams(location.search)
  const documents = JSON.parse(document.getElementById("viewer-documents").textContent)
  const key = params.get("file") ?? ""
  if (!SAFE_KEY.test(key) || !(key in documents)) return null
  const back = params.get("back")
  const safeBack = back && back.startsWith("/") && !back.startsWith("//") ? back : null
  return { key, title: documents[key], back: safeBack }
}

function showError(message) {
  status.hidden = false
  status.textContent = message
}

function setUpChrome({ title, back }, fileUrl) {
  document.title = `${title} | Unicorn Line`
  document.querySelector("[data-viewer-title]").textContent = title
  document.querySelector("[data-viewer-download]").href = fileUrl
  if (back) {
    const backLink = document.querySelector("[data-viewer-back]")
    backLink.href = back
    backLink.textContent = "Back to product"
  }
}

async function renderPage(pdf, slot, zoom) {
  const page = await pdf.getPage(Number(slot.dataset.page))
  const fitWidth = pagesHolder.clientWidth / page.getViewport({ scale: 1 }).width
  const viewport = page.getViewport({ scale: fitWidth * zoom })
  const pixelRatio = window.devicePixelRatio || 1
  const canvas = document.createElement("canvas")
  canvas.width = Math.floor(viewport.width * pixelRatio)
  canvas.height = Math.floor(viewport.height * pixelRatio)
  canvas.setAttribute("aria-hidden", "true")
  await page.render({
    canvas,
    viewport,
    transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
  }).promise
  slot.replaceChildren(canvas)
  slot.style.width = `${viewport.width}px`
  slot.style.aspectRatio = `${viewport.width} / ${viewport.height}`
  slot.dataset.rendered = String(zoom)
}

function buildSlots(pdf, firstPageAspect) {
  const slots = []
  for (let number = 1; number <= pdf.numPages; number++) {
    const slot = document.createElement("div")
    slot.className = "vpage"
    slot.dataset.page = String(number)
    slot.setAttribute("role", "img")
    slot.setAttribute("aria-label", `Page ${number} of ${pdf.numPages}`)
    slot.style.aspectRatio = firstPageAspect
    pagesHolder.append(slot)
    slots.push(slot)
  }
  return slots
}

async function open() {
  const request = readRequest()
  if (!request) {
    showError("This document isn't available. Go back to the catalog and choose a document from a product page.")
    return
  }
  const base = document.querySelector('meta[name="asset-base-url"]').content.replace(/\/+$/, "")
  const fileUrl = `${base}/${request.key.split("/").map(encodeURIComponent).join("/")}`
  setUpChrome(request, fileUrl)

  let pdf
  try {
    pdf = await pdfjs.getDocument({ url: fileUrl, disableAutoFetch: true, disableStream: true }).promise
  } catch (error) {
    showError(`The document couldn't be loaded (${error instanceof Error ? error.message : error}). You can still download it.`)
    return
  }

  const firstPage = await pdf.getPage(1)
  const { width, height } = firstPage.getViewport({ scale: 1 })
  const slots = buildSlots(pdf, `${width} / ${height}`)
  status.hidden = true

  let zoom = FIT_WIDTH_ZOOM
  const visible = new Set()
  const rerender = (slot) =>
    renderPage(pdf, slot, zoom).catch((error) => {
      slot.textContent = `Page ${slot.dataset.page} couldn't be shown: ${error instanceof Error ? error.message : error}`
    })

  const renderObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.dataset.rendered !== String(zoom)) rerender(entry.target)
      }
    },
    { rootMargin: RENDER_MARGIN },
  )
  const pageObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const number = Number(entry.target.dataset.page)
      entry.isIntersecting ? visible.add(number) : visible.delete(number)
    }
    if (visible.size) pageLabel.textContent = `Page ${Math.min(...visible)} of ${pdf.numPages}`
  })
  for (const slot of slots) {
    renderObserver.observe(slot)
    pageObserver.observe(slot)
  }

  for (const button of document.querySelectorAll("[data-viewer-zoom]")) {
    button.addEventListener("click", () => {
      const action = button.dataset.viewerZoom
      if (action === "fit") zoom = FIT_WIDTH_ZOOM
      else zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + (action === "in" ? 1 : -1) * ZOOM_STEP))
      for (const number of visible) rerender(slots[number - 1])
    })
  }
}

open()
