# Changelog

Notable changes to `agyflow-web`. Newest first.

Commit hashes refer to the `main` branch. Dates are WIB (UTC+7).

---

## 2026-09-18

First production deploy of the 2026-09-17 work, plus the deploy procedure
written down.

### Deployed

- 64 files uploaded to `public_html/` on agyflow.com (Rumahweb cPanel) over
  FTP — the entire static export, including the repaired `.htaccess`. See
  `docs/DEPLOY.md`.
- Production had been serving the old build since 2026-09-12, so the routing
  bug fixed on 2026-09-17 was still live until this deploy. Confirmed live
  afterwards:

  | check | before | after |
  |---|---|---|
  | `/products` title | homepage title | catalog title |
  | `/halaman-tidak-ada` | `200` | `404` |
  | `/de` `lang` | — | `de` |
  | trailing slash `/products/` | — | `301` → `/products` |

- All 11 routes (`/`, `/products`, `/de`, `/fr`, and 7 product pages) return
  `200` with distinct, correct titles.

### Added

- **`docs/DEPLOY.md`** — the manual FTP deploy procedure: host facts, the
  three-phase upload ordering, verification commands, rollback, and the curl
  gotchas below. This host has no CI/CD, so the steps only existed as tribal
  knowledge until now.

### Fixed

- **Upload silently skipped the `[slug]` chunk.** Next.js emits a literal
  `[slug]` directory under `_next/static/chunks/app/products/`, and curl
  parses `[slug]` as a character class unless given `-g` (globoff). The URL no
  longer matched the local file and the transfer failed without a useful
  message. Caught by the post-deploy asset sweep; re-uploaded, and `-g` is now
  set in the upload script.

### Notes

- Pushing to GitHub/GitLab does not publish the site — DNS points at Rumahweb,
  and there is no `vercel.json`, `.github/workflows/`, or `netlify.toml`. This
  is called out explicitly in `docs/DEPLOY.md` because it is an easy and
  expensive thing to assume otherwise.
- A full pre-deploy backup lives in `M:\saas\agyflow-backup-2026-09-18\production`
  (50 files, 2.9 MB), including the old buggy `.htaccess`.

---

## 2026-09-17

Dynamic product catalog, build unblocking, and a static routing repair.

Commits: `11789d8`, `3ea6cbd`

### Added

- **Data-driven product catalog.** `data/products.json` is now the single
  source of truth for 7 products: 5 tier-1 products, a bundle, and the
  Montessori printable. `lib/products.ts` exposes typed accessors
  (`getAll`, `bySlug`, `related`, `bundle`, `formatPrice`).
- **`/products` catalog page** with client-side search, category filter, and
  sort (`components/ProductCatalog.tsx`).
- **`/products/[slug]` product pages**, statically generated via
  `generateStaticParams`. Each carries its own metadata, Product JSON-LD, and
  a buy panel wired to the Gumroad checkout links
  (`wkagungster.gumroad.com/l/<slug>`).
- **`components/ProductCover.tsx`** — renders the cover image, with a CSS
  typographic fallback for products that have no cover art.
- **`lib/server/hermes.ts`** — typed adapter for the Hermes agent router, with
  its contract documented in `docs/HERMES_INTEGRATION.md`.
- **Build tooling** (see `docs/BUILD.md`):
  `scripts/build.mjs`, `scripts/clean.mjs`, `scripts/raw-remove.mjs`,
  `scripts/serve.mjs`, `scripts/check-links.mjs`.

### Fixed

- **The production build failed on every run.** The environment runs Node with
  a safe-delete shim that routes `fs.rm` / `fs.rmSync` / `fs.unlink` through
  the OS trash, which times out on this volume. Next.js removes its own
  working directories several times per build, so it died with
  `SAFE_DELETE_BULK_CONFIRM_REQUIRED`, `genie-trash ETIMEDOUT`, or a worker
  exit of `1073807364`. `npm run build` now runs through
  `scripts/build.mjs`, which sets the shim's opt-out flag on the child
  process. **This flag must be present before the child starts**, which is why
  a wrapper is required instead of a `next.config.mjs` option.
- **`public/.htaccess` served the homepage for every clean URL** and returned
  HTTP 200 for missing pages. The catch-all rewrite to `/index.html` meant
  `/products` and `/products/<slug>` rendered the homepage, and `products.html`
  lost to the `products/` directory during DirectoryIndex resolution. Replaced
  with an explicit `.html` probe that runs before directory handling, a
  trailing-slash redirect, `Options -MultiViews`, and a real
  `ErrorDocument 404 /404.html`.

  This affected **production**, not just local preview: agyflow.com is served
  from Rumahweb cPanel via Apache/LiteSpeed, which does read this file.

### Changed

- `npm run build` now runs `node scripts/build.mjs` instead of
  `next build && node scripts/fix-html-lang.mjs`.
- New scripts: `npm run preview`, `npm run check-links`, `npm run clean`.
- `next.config.mjs` documents why `distDir` must not be set for a static
  export — Next treats a custom `distDir` as a request to swap the export
  output directory (`hasCustomExportOutput`), which redirects the export away
  from `out/`.
- `.gitignore` now ignores `*.tsbuildinfo`.

### Verified

- 0 broken internal links across 38 targets.
- Every clean URL (`/de`, `/fr`, `/products`, all 7 product routes) returns 200.
- Missing paths return a real 404 instead of the homepage.
- Product pages render content distinct from the homepage.
- `node_modules` is left unmodified — the fix uses an environment flag, not a
  source patch.

---

## Earlier

Changes before 2026-09-17 are not catalogued here. For context, see:

- `DEPLOYMENT_2026-09-12.md` — visual refresh and SEO cleanup verification
- `docs/I18N.md` — English / German / French routing
- `docs/FASE0_TUTORIAL.md` — Search Console and Bing setup
