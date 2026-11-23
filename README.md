# Unicorn Line

The online catalog for Unicorn Graphics' line of promotional products, at [unicornline.com](https://unicornline.com). Unicorn Graphics is a commercial printing company on Long Island, NY.

It's a static site built by a small Node script. There's no framework and no CMS: the content lives in this repository as JSON.

## Layout

| Path | What it is |
|---|---|
| `content/` | All catalog content: `company.json`, `categories.json`, `featured.json`, and one file per product in `products/` |
| `src/` | The build: content loading and validation, URL rules (`urls.mjs`), and page templates (`render/`) |
| `static/` | Copied into the site as-is: stylesheet, browser scripts, fonts, drawings, logo, Netlify `_redirects` |
| `scripts/` | Maintenance tools: local server, link checker, R2 uploads |
| `site.config.json` | Site URL, the asset host for photos and PDFs, and the main-site links |

Product photos, PDFs and template ZIPs are served from Cloudflare R2, not from Netlify. Content refers to them by key (for example `files/catalogs/catalog-2023-web.pdf`), and `assetBaseUrl` in `site.config.json` says where those keys live.

## Commands

```sh
npm install
npm run dev        # build, then serve dist/ at http://localhost:8080
npm run build      # validate content, render dist/, check every internal link
npm test
```

Netlify runs `npm run build` and publishes `dist/` (see `netlify.toml`).

## Changing content

- **Edit a product:** change its JSON file in `content/products/`. The build stops with the file and field at fault if something is invalid.
- **Add a product:** add `content/products/<slug>.json`. The file name must match the slug.
- **Add or replace photos:** put the originals under a folder at their keys, then run `npm run publish:images -- <folder>`. This makes WebP sizes and uploads any that are missing.
- **Add or replace PDFs or ZIPs:** run `npm run upload:assets -- <folder> files/`. This uploads every referenced file that R2 doesn't already have.

The R2 commands need credentials in `.env` (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`).

Open content questions for the owner are tracked in `CONTENT-REVIEW.md`.
