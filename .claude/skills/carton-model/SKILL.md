---
name: carton-model
description: Add, extend or fix the interactive to-scale isometric carton model on a product page (folding cartons and other boxes whose catalog page has a W x L x D size table). Use when asked to "make the diagram" or "add the model" for a box product, to add a new carton kind (a new closure style), or to change how the model draws, folds, animates, prices or steps between sizes.
---

# Carton model

Products whose catalog page shows an isometric carton diagram get an interactive,
to-scale SVG model in the first slot of the photo gallery. Visitors set width,
length and depth, choose a style and an open or assembled view, step between
listed items, and see that size's prices or a "Get a custom price" button.

Live today: `folding-cartons-tuck-end` (tuck-end-carton), `folding-cartons-seal-end`
(seal-end-carton), `folding-cartons-tuck-top-snap-lock-bottom` (snap-lock-carton),
`folding-cartons-sleeve` (sleeve-carton), `mailer-boxes` (mailer-box), and the solids
`favor-boxes` (favor-box), `pillow-boxes` (pillow-box), `image-wrap-faux-canvas`,
`uniq-prints-chalkboard` and `uniq-prints-dry-erase` (wall-panel).

## Which products get a model

A product qualifies when it is a rigid shape with stated dimensions and its price
depends on its size: the drawing then compares sizes to scale and drives the price
lookup. Left out on purpose (as of 2026-11-24): soft goods, food, liquids and flat
print; ceiling tiles (no stated thickness, and sizes are never invented); golf ball
boxes (nine different shapes); awards, notebooks and pads (fixed sizes, no custom
sizing). Revisit if one of those gains a size table or custom sizes.

## Where things live

| File | Role |
| --- | --- |
| `static/js/solids.js` | Rigid solids with no moving parts (favor wedge, pillow, wall panel), as faces tagged with a `surface` and `printed`. |
| `static/js/carton.js` | Pure geometry and SVG rendering, shared by the build and the browser. `KINDS`, `cartonState`, `cartonGeometry`, `cartonPolygons`, `renderCartonSvg`, `cartonViewBox`, sizing helpers (`itemForSize`, `steppedSize`, `customSizeMessage`, `customSizeProduct`). |
| `static/js/carton-view.js` | Browser: reads the form, tweens between states, updates prices, step buttons and the custom-price block. |
| `static/js/segmented.js` | The design system's segmented control (style and view). |
| `static/js/price-row.js` | Renders the matching pricing row as quantity and price pairs (build and browser). |
| `src/render/carton-model.mjs` | Server render: gallery panel, gallery thumbnail, the controls form. |
| `src/render/product.mjs` | Puts the panel and thumbnail in the gallery and the controls in the left column in place of the quote button. |
| `src/validate.mjs` | `checkModel`: kind must be in `KINDS`, sizes need item, w, l, d; every model item must have a pricing row. |
| `scripts/parse-carton-sizes.mjs` | Reads the size table from a product's catalog-page PDF and writes the model. |
| `test/carton.test.mjs` | Pricing lookup, stepping, the aria-label, and two geometry tests across every kind: no flap through a wall, and no flap through another flap along the real animation path. |

## Adding the model to a product whose closure already exists

1. Look at the product's diagram image (`content/products/<slug>.json` images, originals in `.export/assets/images/<slug>/` when present) and match it to a kind in `KINDS`.
2. Write the model from the catalog page:
   `npm run parse:carton-sizes -- <slug>` prints the parsed table so you can check it, then
   `npm run parse:carton-sizes -- <slug> --type <kind> [--default 2x2x5]` writes it.
   The default size must be a listed size, so prices show on first paint. Use `--pdf <path>` for a local file.
3. `npm test` and `npm run build`. The build fails if an item has no pricing row.
4. Screenshot the product page open and assembled (see "Checking it"), then commit.

**Products without a size-table PDF.** When the pricing table itself names the sizes
(the mailer boxes' "Size" column reads "8 x 8 x 2.75 in."), write the model by hand:
each size's `item` is that exact pricing label, so the price row and table highlight
match it. Read L x W x D from the label and check the order against the photos.
Items are ordered naturally (`compareItems`), so "8 x 8" steps before "10 x 10".

The parser expects the 2023 catalog layout: blocks headed `ITEM NO | W | L | D`, item
numbers in merged cells bounded by horizontal rules, and merged cells that may
continue unlabeled at the head of the next column. It was verified to reproduce the
hand-checked tuck end table exactly. If a new catalog changes the layout, print the
table and spot-check several rows against the PDF before writing.

## Adding a solid kind

1. Write a builder in `solids.js` returning faces `{ points, surface, printed? }` and add it to `SOLIDS`. Winding does not matter: `solidShapes` turns each normal away from the solid's centre, culls faces turned away from the viewer and paints the rest far to near.
2. Faces of one smooth surface share a `surface` name, so their seams stay hidden and only the outline and real creases are drawn. Keep the solid convex, or close to it.
3. Add the kind to `KINDS` with `solid`, and `dimensions`: field labels, the letter on each dimension line, the word for the description, `order` (how the product writes a size), `fixed` sizes the material sets (a board's thickness, carried in a hidden field), and `turns: true` when a size on its side is the same product.

## Adding a new kind (a new closure)

1. Add an entry to `KINDS` in `carton.js`: `label` (used in the aria-label), `top` and
   `bottom` closure names (or `null` for an open or rigid end), optional `styles` map,
   and `dustFlaps: false` when the kind has none, so its lid uses the whole animation.
   The mailer box (`mailerEnd`) is the example of a shape with no catalog diagram:
   model it from the product photos, as a rigid tray plus the parts that move.
2. If the closure is new, write an end builder and register it in `END_BUILDERS`.
   Builders return flaps made with `lidAssembly` (lid plus tuck), `longEdgeFlap`
   (flaps hinged on the L edges at y = 0 or y = W) or `shortEdgeFlap` (flaps hinged
   on the W edges at x = 0 or x = L). Every flap carries `angle`, `edge`
   (`back`, `front`, `left`, `right`) and `role` (`lid`, `tuck`, `major`, `dust`).
3. Size new flap outlines in `flapSizes`, from the carton's own W and L.
4. Run the tests: both geometry tests pick up every kind and style automatically.

## Rules the geometry follows

- **Axes.** x along L, y along W, z up along D. The viewer looks from (+1, +1, +1), so the visible walls are the front (y = W) and the right side (x = L). Projection: `sx = (x - y) cos 30`, `sy = (x + y) / 2 - z`.
- **Folds.** State holds `topLid`, `topDust`, `bottomLid`, `bottomDust` from 0 (closed) to 1 (open). Lid folds move long-edge flaps, dust folds move short-edge flaps. Each is a real hinge angle, so any value can be drawn.
- **Never through a wall.** No flap point may sit between floor and rim outside the walls at any fold. A closing tuck bends past square (`TUCK_INTO_CAVITY`) and slides down inside the far wall, straightening only after its tip clears the rim. Tucks inside the box are painted after the interior and before the walls. Keep the wall-clearance test green, and when you change folding, mutate a constant to confirm the test still fails.
- **Flaps that turn with a lid.** Mailer ears stand square to the lid and rotate with it. Any point farther from the hinge than the box is wide would swing through the front wall, so ears are cut back to a quarter circle about the hinge (`mailerEarOutline`), less the tuck's clearance.
- **Never through each other.** Flaps at one end take turns. Dust flaps close before the lid or majors (the fold windows in `foldStateAt`). Two majors that close onto each other split their fold with `backFold` and `frontFold`, so the front one only comes down once the back one lies flat. Flaps folding in from opposite edges reach under half the span (`FACING_FLAP_REACH`). Dust flaps next to a tuck get a relief cut sized by `tuckRelief`, so the tuck slides down past them. The flap-crossing test walks `foldStateAt` both ways; when you change folding, break one of these rules on purpose and confirm the test fails.
- **Painter's order.** Bottom flaps behind the walls, then the interior, cavity tucks, walls and print panel, then bottom flaps on near edges once they pass `FLAT_ANGLE`, then the top flaps. Top flaps: open, far before near; nearly flat, in closing order (dust flaps, back, front).
- **Dimension lines.** W, L and D always show. L and W drop below the lowest open bottom flap with dashed extension lines, and they always count toward the frame, so the view doesn't jump.
- **Colors.** Only the design system's illustration tones: paper and illus-grey for board, illus-ink for the shadowed cavity, blue for the print panel. Every kind, the sleeve included, uses the same shadowed interior.
- **Animation.** `carton-view.js` tweens every change through `foldStateAt` in `carton.js`. Opening runs lid then dust; closing runs dust then lid. A style change first folds the bottom shut. Reduced motion jumps straight to the result.

## Pricing behaviour

- Prices, "Priced as …" and the table highlight appear only for an exact listed size.
- Any other size shows the custom-price note and a "Get a custom price" button; the quote link carries the product, style and size in `?product=`.
- The previous and next buttons step to the nearest size of the adjacent item code, or round an unlisted size up or down to a listed one. They use `aria-disabled` at the ends.

## Checking it

Build, serve (`npm run dev`, port 8080) and screenshot
`/gift-box/<slug>/` in a headless browser with the view set to open and to
assembled. Look for flaps crossing walls, wrong overlap order, and labels that
collide. Then exercise the step buttons and an unlisted size.
