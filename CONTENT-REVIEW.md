# Content review for the owner

These questions came up while migrating and copy-editing the catalog. None of them were changed without your approval. Tick each one off once it's decided, and delete this file when the list is empty.

## Copy approval

- [ ] All product copy was rewritten in the redesign's style: plain wording, sentence case, consistent units. Names, item codes, quantities and prices are unchanged. To compare a product with the original, run `git diff 454afe6 f12cf98 -- content/products/<slug>.json`.
- [ ] The category one-liners and featured items now use the designer's wording.
- [ ] Wood species and product names keep their capitals ("Red Oak", "Mani in a Box"), while generic table text is in sentence case ("French lavender", "Gift box (option)"). Should flavour and scent names such as "Lavender Ultra", "Masala Chai" and "Berries & Cream" keep their capitals?
- [ ] Sizes in feet are written "2 x 2 ft" (acoustic-ceiling-tiles). Is that the right style?
- [ ] Renamed table columns: "Type" became "Scent" (2-wick-candles, potpourri); "Type" became "Size" (notable-notepads, notable-desk-planners, lifestyle, notable-notebooks); "Side" became "Sides" (folding cartons); "Coating" became "Sides" (folding-cartons-tuck-top-snap-lock-bottom).

## Likely errors in the source data

- [ ] Gift box item code "3435T" is missing its "U" (chili-peppers, spices, peppercorns, protein-powder, spices-herbs, superfood-powder, sprouting-seeds). Teas and salts use "U3435T".
- [ ] fizz-off-bottle-cleaning-tablet quantity columns read 100, 2500, 500, 1000… The second one is probably 250.
- [ ] folding-cartons-sleeve materials say "U510 - 5518". This is probably "U5510 - 5518".
- [ ] sugar-scrub materials code "U2500~1" doesn't match the table code "U2520~1".
- [ ] door-hangers-plastic note refers to "U2142". The product codes are U5140–5142.
- [ ] just-in-case materials say "U3070-3972", but the table says "U3070-72".
- [ ] award-popout materials cover "U8400 ~ 8403", but there is no U8401 row.
- [ ] award-tower: "20mm Aluminum" is probably 20mil. The print area range runs to U8234, but the table ends at U8233. It claims "4 standard shapes", but the table has 2 sizes. "1mm clear plastic": the word "plastic" was inferred from the Material column.
- [ ] "8t gloss cover" is probably "8pt" (gloves-socks, mani-pedi, shower-filter).
- [ ] Artwork change is $27 (G) on award-popout and award-glow-cuboid and $37 (G) on hanging-permits-paper, but $67 (G) elsewhere.
- [ ] Printing method conflicts between the pricing note and the specs: coin-set, desk-mats-coasters and popout (note says Inkjet, specs say Digital); pocket-caddy (specs say digital and offset, pricing is digital only).
- [ ] Die charge contradictions: the folding cartons (all three) and pillow-boxes say "no die charge" or price odd sizes at the next size up, yet list a die charge per custom size. golf-tee-packs says "No custom shapes available" but lists a die charge.
- [ ] Shape and size counts don't match their tables: hang-tags-paper and hang-tags-plastic ("15 shapes", 13 rows), labels-plastic ("40 shapes", 14 rows), shelf-wobblers ("two standard shapes", 5 items), lip-balms ("eight flavors", 7 listed).
- [ ] golf-tee-packs tee lengths (2.125, 2.75, 3.25) have no unit. Are they inches?
- [ ] gift-sets-hexagon says "Hexagon food-grade tins", but the photos show square tins in hexagonal boxes. "Only candles packed five in recyclable glass jar" is also ambiguous.
- [ ] shea-butter-cream: the product is called a cream but the table says "lotion". Its intro is copied from mani-pedi.
- [ ] Health claims kept as written: nuts ("can promote a healthy heart"), sprouting-seeds ("enzymes that help boost metabolism"), leather-goods ("a non-chemical process").
- [ ] wipes-and-lotions pricing rows have only item codes, with no description of which wipe or lotion each row is.

## Photos

- [ ] The "100% Handmade in USA" badge from the candles appears on products where it may not be true: every award product, leather-goods, lifestyle (Tyvek pouches), the Notable notebooks, notepads and memo, popout and soap-bars.
- [ ] shea-butter-cream includes a mani-pedi photo (manicured hands and feet).
- [ ] leather-goods includes three oak wood items (a pen tray and two pen holders).
- [ ] hang-tags-plastic and hanging-permits-plastic use the paper versions' thumbnails.
- [ ] award-tower: the thumbnail is the same file as the first gallery photo. coin-set has a near-duplicate photo and one with faint iStock watermarks.
- [ ] folding-cartons-sleeve: one photo has "low cast solution" printed in it (should be "low cost").

## Open questions from the design handoff

- [ ] Should "Get a free quote" pass the product name through to the quote form on unicorngraphics.com?
- [ ] A newer full catalog PDF, to replace the 2023 one.
