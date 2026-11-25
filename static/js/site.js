// Progressive enhancement for the catalog pages. Every feature checks for its
// markup first, so pages work without this script.

const SEARCH_DEBOUNCE_MS = 150
const MAX_DROPDOWN_RESULTS = 8

function debounce(fn, waitMs) {
  let timer
  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), waitMs)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

// One entry per product, read from the index markup. A product listed under two
// categories is labelled with its primary category (the first segment of its URL).
function readProducts(categories) {
  const nameBySlug = new Map(categories.map((category) => [category.id, category.dataset.category]))
  const byPath = new Map()
  for (const category of categories) {
    for (const link of category.querySelectorAll("li a")) {
      if (byPath.has(link.pathname)) continue
      const primarySlug = link.pathname.split("/")[1]
      byPath.set(link.pathname, {
        name: link.textContent.trim(),
        href: link.getAttribute("href"),
        categoryName: nameBySlug.get(primarySlug) ?? category.dataset.category,
        categoryNames: [category.dataset.category],
      })
    }
  }
  for (const category of categories) {
    for (const link of category.querySelectorAll("li a")) {
      const product = byPath.get(link.pathname)
      if (!product.categoryNames.includes(category.dataset.category)) product.categoryNames.push(category.dataset.category)
    }
  }
  return [...byPath.values()]
}

// Same rule as the index filter: the query appears in the product or category name.
// Name matches rank first, and names that start with the query rank highest.
function rankMatches(products, query) {
  const scored = []
  for (const product of products) {
    const name = product.name.toLowerCase()
    const position = name.indexOf(query)
    if (position === 0) scored.push([0, product])
    else if (position > 0) scored.push([1, product])
    else if (product.categoryNames.some((categoryName) => categoryName.toLowerCase().includes(query))) scored.push([2, product])
  }
  return scored.sort((a, b) => a[0] - b[0]).map(([, product]) => product)
}

function highlighted(text, query) {
  const fragment = document.createDocumentFragment()
  const position = text.toLowerCase().indexOf(query)
  if (position < 0) {
    fragment.append(text)
    return fragment
  }
  const mark = document.createElement("mark")
  mark.textContent = text.slice(position, position + query.length)
  fragment.append(text.slice(0, position), mark, text.slice(position + query.length))
  return fragment
}

// A sentinel just above the search bar leaves view the moment the bar sticks.
function setUpStickySearch() {
  const bar = document.querySelector("[data-search-bar]")
  if (!bar || !("IntersectionObserver" in window)) return
  const sentinel = document.createElement("div")
  sentinel.setAttribute("aria-hidden", "true")
  bar.before(sentinel)
  const headerHeight = document.querySelector(".hdr")?.offsetHeight ?? 0
  new IntersectionObserver(([entry]) => bar.classList.toggle("is-stuck", !entry.isIntersecting), {
    rootMargin: `-${headerHeight}px 0px 0px 0px`,
  }).observe(sentinel)
}

function setUpSearch() {
  const input = document.querySelector("[data-search]")
  if (!input) return
  const box = document.querySelector("[data-search-box]")
  const dropdown = document.querySelector("[data-search-results]")
  const count = document.querySelector("[data-search-count]")
  const empty = document.getElementById("no-results")
  const categories = [...document.querySelectorAll("[data-category]")]
  const products = readProducts(categories)
  let options = []
  let activeIndex = -1

  function filterIndex(query) {
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
    count.textContent = query ? `${shown.size} of ${products.length}` : ""
    empty.hidden = !(query && shown.size === 0)
  }

  function setActive(index) {
    options.forEach((option, optionIndex) => option.setAttribute("aria-selected", String(optionIndex === index)))
    activeIndex = index
    if (index >= 0) {
      input.setAttribute("aria-activedescendant", options[index].id)
      options[index].scrollIntoView({ block: "nearest" })
    } else {
      input.removeAttribute("aria-activedescendant")
    }
  }

  function closeDropdown() {
    dropdown.hidden = true
    input.setAttribute("aria-expanded", "false")
    setActive(-1)
  }

  function renderDropdown(query) {
    if (!query) {
      options = []
      closeDropdown()
      return
    }
    const matches = rankMatches(products, query)
    dropdown.replaceChildren()
    options = matches.slice(0, MAX_DROPDOWN_RESULTS).map((product, index) => {
      const option = document.createElement("a")
      option.id = `search-option-${index}`
      option.href = product.href
      option.setAttribute("role", "option")
      option.setAttribute("aria-selected", "false")
      option.tabIndex = -1
      const name = document.createElement("span")
      name.className = "search-name"
      name.append(highlighted(product.name, query))
      const category = document.createElement("span")
      category.className = "search-category"
      category.textContent = product.categoryName
      option.append(name, category)
      return option
    })
    dropdown.append(...options)
    if (matches.length === 0) {
      const message = document.createElement("p")
      message.textContent = "No products match your search."
      dropdown.append(message)
    } else if (matches.length > options.length) {
      const more = document.createElement("p")
      more.textContent = `Showing ${options.length} of ${matches.length}. All matches are listed in the catalog below.`
      dropdown.append(more)
    }
    dropdown.hidden = false
    input.setAttribute("aria-expanded", "true")
    setActive(-1)
  }

  function run() {
    const query = input.value.trim().toLowerCase()
    filterIndex(query)
    renderDropdown(query)
  }
  const debouncedRun = debounce(run, SEARCH_DEBOUNCE_MS)

  input.addEventListener("input", debouncedRun)
  input.addEventListener("focus", () => {
    if (input.value.trim()) renderDropdown(input.value.trim().toLowerCase())
  })
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (dropdown.hidden) run()
      if (options.length === 0) return
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((activeIndex + step + options.length) % options.length)
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault()
      options[activeIndex].click()
    } else if (event.key === "Escape" && !dropdown.hidden) {
      event.preventDefault()
      closeDropdown()
    }
  })
  document.addEventListener("pointerdown", (event) => {
    if (!box.contains(event.target)) closeDropdown()
  })
  box.addEventListener("focusout", (event) => {
    if (!box.contains(event.relatedTarget)) closeDropdown()
  })
  document.querySelector("[data-clear-search]")?.addEventListener("click", () => {
    debouncedRun.cancel()
    input.value = ""
    run()
    input.focus()
  })
}

// The stage holds the carton model (when there is one) and the main photo side
// by side; switching hides one rather than removing it, so the model keeps its state.
// Changing a model control while a photo shows brings the model back.
function setUpGallery() {
  const stage = document.querySelector("[data-gallery-stage]")
  const main = document.querySelector("[data-gallery-main]")
  const links = [...document.querySelectorAll(".thumbs a")]
  const modelParts = [...document.querySelectorAll("[data-gallery-model]")]
  if (!stage || !main || links.length === 0) return

  function show(element) {
    stage.querySelector(".stage-video")?.remove()
    main.hidden = element !== main
    for (const part of modelParts) part.hidden = element !== "model"
  }

  function showPhoto(link) {
    main.src = link.dataset.full
    main.srcset = link.dataset.srcset
    main.alt = link.dataset.alt
    main.width = Number(link.dataset.width)
    main.height = Number(link.dataset.height)
    show(main)
  }

  function showVideo(link) {
    const frame = document.createElement("iframe")
    frame.className = "stage-video"
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.video)}?autoplay=1&rel=0`
    frame.title = link.dataset.title
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"
    frame.allowFullscreen = true
    show(frame)
    stage.append(frame)
  }

  const modelLink = links.find((link) => "model" in link.dataset)
  document.querySelector("[data-carton-controls]")?.addEventListener("input", () => {
    if (modelLink && modelLink.getAttribute("aria-current") !== "true") modelLink.click()
  })

  for (const link of links) {
    link.addEventListener("click", (event) => {
      event.preventDefault()
      if (link.dataset.video) showVideo(link)
      else if ("model" in link.dataset) show("model")
      else showPhoto(link)
      for (const other of links) other.removeAttribute("aria-current")
      link.setAttribute("aria-current", "true")
    })
  }
}

setUpSearch()
setUpStickySearch()
setUpGallery()
