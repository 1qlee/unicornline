// Progressive enhancement for the catalog pages. Every feature checks for its
// markup first, so pages work without this script.

function setUpSearch() {
  const input = document.querySelector("[data-search]")
  if (!input) return
  const count = document.querySelector("[data-search-count]")
  const empty = document.getElementById("no-results")
  const categories = [...document.querySelectorAll("[data-category]")]
  const total = new Set(categories.flatMap((category) => [...category.querySelectorAll("li a")].map((link) => link.pathname))).size

  function run() {
    const query = input.value.trim().toLowerCase()
    const shown = new Set()
    for (const category of categories) {
      const categoryMatches = category.dataset.category.toLowerCase().includes(query)
      let visible = 0
      for (const item of category.querySelectorAll("li")) {
        const hit = !query || categoryMatches || item.textContent.toLowerCase().includes(query)
        item.hidden = !hit
        if (hit) {
          visible++
          shown.add(item.querySelector("a").pathname)
        }
      }
      category.hidden = visible === 0
    }
    count.textContent = query ? `${shown.size} of ${total}` : ""
    empty.hidden = !(query && shown.size === 0)
  }

  input.addEventListener("input", run)
  document.querySelector("[data-clear-search]")?.addEventListener("click", () => {
    input.value = ""
    run()
    input.focus()
  })
}

function setUpHeadingReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion || !("IntersectionObserver" in window)) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.remove("pre")
        entry.target.classList.add("go")
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.3 },
  )
  for (const heading of document.querySelectorAll(".h2")) {
    heading.classList.add("pre")
    observer.observe(heading)
  }
}

function setUpGallery() {
  const main = document.querySelector("[data-gallery-main]")
  const links = [...document.querySelectorAll(".thumbs a")]
  if (!main || links.length === 0) return
  for (const link of links) {
    link.addEventListener("click", (event) => {
      event.preventDefault()
      main.src = link.dataset.full
      main.srcset = link.dataset.srcset
      main.alt = link.dataset.alt
      main.width = Number(link.dataset.width)
      main.height = Number(link.dataset.height)
      for (const other of links) other.removeAttribute("aria-current")
      link.setAttribute("aria-current", "true")
    })
  }
}

function setUpVideos() {
  for (const tile of document.querySelectorAll("[data-video]")) {
    tile.addEventListener("click", (event) => {
      event.preventDefault()
      const frame = document.createElement("iframe")
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(tile.dataset.video)}?autoplay=1`
      frame.title = tile.getAttribute("aria-label").replace(/^Play /, "")
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"
      frame.allowFullscreen = true
      const holder = document.createElement("div")
      holder.className = "vid"
      holder.append(frame)
      tile.replaceWith(holder)
      frame.focus()
    })
  }
}

setUpSearch()
setUpHeadingReveal()
setUpGallery()
setUpVideos()
